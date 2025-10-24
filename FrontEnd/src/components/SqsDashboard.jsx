import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

const SqsDashboard = () => {
  const [queues, setQueues] = useState([]);
  const [dlqStats, setDlqStats] = useState([]);
  const [failureLogs, setFailureLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSqsData();
    const interval = setInterval(fetchSqsData, 10000); // Atualizar a cada 10 segundos
    return () => clearInterval(interval);
  }, []);

  const fetchSqsData = async () => {
    try {
      const [queuesResponse, dlqResponse, failuresResponse] = await Promise.all([
        fetch('/api/sqs/queues/stats', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
        }),
        fetch('/api/sqs/dlq/stats', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
        }),
        fetch('/api/sqs/failures', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
        })
      ]);

      if (!queuesResponse.ok || !dlqResponse.ok || !failuresResponse.ok) {
        throw new Error('Failed to fetch SQS data');
      }

      const [queuesData, dlqData, failuresData] = await Promise.all([
        queuesResponse.json(),
        dlqResponse.json(),
        failuresResponse.json()
      ]);

      setQueues(queuesData.queues);
      setDlqStats(dlqData.dlq_stats);
      setFailureLogs(failuresData.failure_logs);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const recoverFromDlq = async (queueName, messageIds) => {
    try {
      const response = await fetch(`/api/sqs/dlq/${queueName}/recover`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message_ids: messageIds })
      });

      if (!response.ok) {
        throw new Error('Failed to recover messages');
      }

      fetchSqsData();
    } catch (err) {
      setError(err.message);
    }
  };

  const purgeQueue = async (queueName) => {
    try {
      const response = await fetch(`/api/sqs/queue/${queueName}/purge`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to purge queue');
      }

      fetchSqsData();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando dados SQS...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Erro ao carregar dados: {error}</div>
      </div>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard SQS + DLQ</h1>
        <Button onClick={fetchSqsData} variant="outline">
          Atualizar
        </Button>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Filas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{queues.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mensagens Totais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {queues.reduce((sum, queue) => sum + queue.messages, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mensagens na DLQ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {dlqStats.reduce((sum, dlq) => sum + dlq.messages, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Falhas Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {failureLogs.filter(log => log.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="queues">Filas SQS</TabsTrigger>
          <TabsTrigger value="dlq">Dead Letter Queue</TabsTrigger>
          <TabsTrigger value="failures">Logs de Falha</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Mensagens por Fila</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={queues}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="messages" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status das Filas</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={queues.map(queue => ({
                        name: queue.name,
                        value: queue.messages,
                        status: queue.messages > 100 ? 'high' : queue.messages > 50 ? 'medium' : 'low'
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {queues.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="queues" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {queues.map((queue) => (
              <Card key={queue.name}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {queue.name}
                    <Badge variant={queue.messages > 100 ? "destructive" : "secondary"}>
                      {queue.messages} msgs
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Em Processamento:</span>
                      <span className="text-sm font-medium">{queue.in_flight}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Atrasadas:</span>
                      <span className="text-sm font-medium">{queue.delayed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Timeout:</span>
                      <span className="text-sm font-medium">{queue.visibility_timeout}s</span>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => fetchSqsData()}
                      >
                        Atualizar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => purgeQueue(queue.name)}
                      >
                        Limpar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="dlq" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Dead Letter Queues</h3>
            <Button onClick={fetchSqsData} variant="outline">
              Atualizar
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dlqStats.map((dlq) => (
              <Card key={dlq.name}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {dlq.name}
                    <Badge variant={dlq.messages > 0 ? "destructive" : "secondary"}>
                      {dlq.messages} msgs
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Mensagens:</span>
                      <span className="text-sm font-medium">{dlq.messages}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Última Atualização:</span>
                      <span className="text-sm font-medium">
                        {new Date(dlq.last_modified).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => recoverFromDlq(dlq.name, [])}
                      >
                        Recuperar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => purgeQueue(dlq.name)}
                      >
                        Limpar DLQ
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="failures" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Logs de Falha</h3>
            <Button onClick={fetchSqsData} variant="outline">
              Atualizar
            </Button>
          </div>
          
          <div className="space-y-2">
            {failureLogs.map((log) => (
              <Card key={log.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{log.service}</div>
                      <div className="text-sm text-gray-600">{log.error_message}</div>
                      <div className="text-xs text-gray-500">
                        Order: {log.order_id} | Action: {log.action}
                      </div>
                      <div className="text-xs text-gray-500">
                        Ocorreu em: {new Date(log.occurred_at).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={
                        log.status === 'pending' ? 'destructive' :
                        log.status === 'auto_recovery_attempted' ? 'secondary' :
                        log.status === 'manual_intervention_required' ? 'outline' : 'default'
                      }>
                        {log.status}
                      </Badge>
                      {log.status === 'pending' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => recoverFromDlq(log.service, [log.id])}
                        >
                          Recuperar
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SqsDashboard;
