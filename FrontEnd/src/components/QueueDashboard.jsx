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
  Cell
} from 'recharts';

const QueueDashboard = () => {
  const [queueStats, setQueueStats] = useState(null);
  const [selectedQueue, setSelectedQueue] = useState(null);
  const [failedJobs, setFailedJobs] = useState([]);
  const [scheduledJobs, setScheduledJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQueueStats();
    const interval = setInterval(fetchQueueStats, 5000); // Atualizar a cada 5 segundos
    return () => clearInterval(interval);
  }, []);

  const fetchQueueStats = async () => {
    try {
      const response = await fetch('/api/queue/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch queue stats');
      }
      
      const data = await response.json();
      setQueueStats(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchQueueDetails = async (queueName) => {
    try {
      const response = await fetch(`/api/queue/${queueName}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch queue details');
      }
      
      const data = await response.json();
      setSelectedQueue(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchFailedJobs = async () => {
    try {
      const response = await fetch('/api/queue/failed', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch failed jobs');
      }
      
      const data = await response.json();
      setFailedJobs(data.failed_jobs);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchScheduledJobs = async () => {
    try {
      const response = await fetch('/api/queue/scheduled', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch scheduled jobs');
      }
      
      const data = await response.json();
      setScheduledJobs(data.scheduled_jobs);
    } catch (err) {
      setError(err.message);
    }
  };

  const clearQueue = async (queueName) => {
    try {
      const response = await fetch(`/api/queue/${queueName}/clear`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to clear queue');
      }
      
      fetchQueueStats();
    } catch (err) {
      setError(err.message);
    }
  };

  const retryFailedJobs = async (queueName) => {
    try {
      const response = await fetch(`/api/queue/${queueName}/retry`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to retry jobs');
      }
      
      fetchQueueStats();
      fetchFailedJobs();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando estatísticas das filas...</div>
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

  if (!queueStats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Nenhum dado disponível</div>
      </div>
    );
  }

  // Preparar dados para gráficos
  const queueData = Object.entries(queueStats.queues).map(([name, stats]) => ({
    name: name,
    size: stats.size,
    latency: stats.latency,
    workers: stats.workers
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard de Filas</h1>
        <Button onClick={fetchQueueStats} variant="outline">
          Atualizar
        </Button>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{queueStats.general.total_jobs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jobs Falhados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{queueStats.general.failed_jobs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jobs em Retry</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{queueStats.general.retry_jobs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jobs Agendados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{queueStats.general.scheduled_jobs}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="queues">Filas</TabsTrigger>
          <TabsTrigger value="failed">Jobs Falhados</TabsTrigger>
          <TabsTrigger value="scheduled">Jobs Agendados</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Tamanho das Filas</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={queueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="size" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Latência das Filas</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={queueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="latency" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="queues" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(queueStats.queues).map(([name, stats]) => (
              <Card key={name}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {name}
                    <Badge variant={stats.size > 100 ? "destructive" : "secondary"}>
                      {stats.size} jobs
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Latência:</span>
                      <span className="text-sm font-medium">{stats.latency.toFixed(2)}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Workers:</span>
                      <span className="text-sm font-medium">{stats.workers}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      {stats.description}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => fetchQueueDetails(name)}
                      >
                        Detalhes
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => clearQueue(name)}
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

        <TabsContent value="failed" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Jobs Falhados</h3>
            <Button onClick={fetchFailedJobs} variant="outline">
              Atualizar
            </Button>
          </div>
          
          <div className="space-y-2">
            {failedJobs.map((job) => (
              <Card key={job.jid}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{job.class}</div>
                      <div className="text-sm text-gray-600">{job.error_message}</div>
                      <div className="text-xs text-gray-500">
                        Falhou em: {new Date(job.failed_at).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="destructive">
                        Retry: {job.retry_count}
                      </Badge>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => retryFailedJobs(job.class)}
                      >
                        Retry
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Jobs Agendados</h3>
            <Button onClick={fetchScheduledJobs} variant="outline">
              Atualizar
            </Button>
          </div>
          
          <div className="space-y-2">
            {scheduledJobs.map((job) => (
              <Card key={job.jid}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{job.class}</div>
                      <div className="text-sm text-gray-600">
                        Args: {JSON.stringify(job.args)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Agendado para: {new Date(job.scheduled_at * 1000).toLocaleString()}
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {job.class}
                    </Badge>
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

export default QueueDashboard;
