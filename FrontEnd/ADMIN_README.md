# Área Administrativa - Frontend React

## Visão Geral

A área administrativa está agora integrada ao frontend React e pode ser acessada através da porta 5174. Ela oferece uma interface moderna e responsiva para gerenciar produtos e pedidos.

## Acesso

### URL da Área Administrativa
- **Dashboard:** `http://localhost:5174/admin`
- **Produtos:** `http://localhost:5174/admin/products`
- **Pedidos:** `http://localhost:5174/admin/orders`

### Como Acessar
1. Certifique-se de que o servidor frontend está rodando: `npm run dev`
2. Acesse `http://localhost:5174/admin`
3. A interface administrativa será exibida automaticamente

## Funcionalidades

### Dashboard (`/admin`)
- **Estatísticas em Tempo Real:** Cards com total de produtos, pedidos e pedidos pendentes
- **Pedidos Recentes:** Lista dos pedidos mais recentes com status e valores
- **Produtos Recentes:** Lista dos produtos mais recentes com preços e disponibilidade
- **Navegação Rápida:** Botões para acessar gerenciamento completo de produtos e pedidos

### Gerenciamento de Produtos (`/admin/products`)

#### Interface Moderna
- **Cards Visuais:** Cada produto exibido em um card com informações completas
- **Ações Rápidas:** Botões de editar e excluir em cada produto
- **Status Visual:** Indicadores visuais de disponibilidade (verde/vermelho)

#### Criar/Editar Produtos
- **Modal Interativo:** Formulário em modal para criar/editar produtos
- **Campos Completos:** Nome, categoria, descrição, preço, URL da imagem, disponibilidade
- **Validação:** Campos obrigatórios e validação de tipos
- **Feedback Visual:** Confirmações e mensagens de sucesso

#### Funcionalidades
- ✅ **Criar Produto:** Adicionar novos produtos ao catálogo
- ✅ **Editar Produto:** Modificar informações existentes
- ✅ **Excluir Produto:** Remover produtos com confirmação
- ✅ **Visualizar Status:** Ver disponibilidade de cada produto

### Gerenciamento de Pedidos (`/admin/orders`)

#### Interface Intuitiva
- **Cards Informativos:** Cada pedido em um card com dados do cliente
- **Status Dinâmico:** Dropdown para alterar status do pedido
- **Informações Completas:** Nome, telefone, email, endereço, valor, data

#### Controle de Status
- **Status Disponíveis:**
  - 🟡 **Pendente:** Pedido recebido, aguardando confirmação
  - 🔵 **Confirmado:** Pedido confirmado pelo estabelecimento
  - 🟠 **Em Preparação:** Pedido sendo preparado
  - 🟢 **Pronto:** Pedido pronto para entrega
  - ⚫ **Entregue:** Pedido entregue ao cliente

#### Detalhes do Pedido
- **Modal Detalhado:** Visualizar informações completas do pedido
- **Informações do Cliente:** Nome, telefone, email, endereço
- **Itens do Pedido:** Lista com produtos, quantidades e preços
- **Observações:** Notas especiais do cliente
- **Histórico:** Data e hora do pedido

## Navegação

### Menu Administrativo
- **Dashboard:** Página inicial com estatísticas
- **Produtos:** Gerenciamento completo de produtos
- **Pedidos:** Controle de todos os pedidos
- **Sair:** Voltar para a área pública

### Design Responsivo
- **Desktop:** Interface completa com todas as funcionalidades
- **Mobile:** Menu hambúrguer e layout adaptado
- **Tablet:** Layout intermediário otimizado

## Tecnologias Utilizadas

### Frontend
- **React 18:** Framework principal
- **React Router:** Navegação entre páginas
- **Tailwind CSS:** Estilização moderna
- **Lucide React:** Ícones
- **Shadcn/ui:** Componentes de interface

### Componentes
- **AdminNavigation:** Navegação específica para área administrativa
- **AdminDashboard:** Dashboard com estatísticas
- **AdminProducts:** Gerenciamento de produtos
- **AdminOrders:** Controle de pedidos

## Integração com Backend

### API Endpoints (Futuro)
- `GET /api/admin/dashboard` - Estatísticas do dashboard
- `GET /api/admin/products` - Listar produtos
- `POST /api/admin/products` - Criar produto
- `PUT /api/admin/products/:id` - Atualizar produto
- `DELETE /api/admin/products/:id` - Excluir produto
- `GET /api/admin/orders` - Listar pedidos
- `PUT /api/admin/orders/:id` - Atualizar status do pedido

### Autenticação (Futuro)
- Sistema de login para administradores
- Tokens JWT para autenticação
- Middleware de autorização

## Personalização

### Cores e Tema
- **Cores Principais:** Verde (#16a34a) para identidade do Cheiro Verde
- **Status Colors:** Cores específicas para cada status de pedido
- **Responsividade:** Adaptação para diferentes tamanhos de tela

### Adicionar Novas Funcionalidades
1. Criar novo componente na pasta `src/pages/`
2. Adicionar rota no `App.jsx`
3. Incluir link na `AdminNavigation.jsx`

## Desenvolvimento

### Estrutura de Arquivos
```
src/
├── components/
│   ├── AdminNavigation.jsx
│   └── ui/
├── pages/
│   ├── AdminDashboard.jsx
│   ├── AdminProducts.jsx
│   └── AdminOrders.jsx
└── App.jsx
```

### Comandos Úteis
```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Construir para produção
npm run build

# Verificar linting
npm run lint
```

## Próximos Passos

### Melhorias Futuras
- [ ] Integração com API do backend
- [ ] Sistema de autenticação
- [ ] Filtros e busca avançada
- [ ] Relatórios e gráficos
- [ ] Notificações em tempo real
- [ ] Upload de imagens
- [ ] Exportação de dados

### Funcionalidades Avançadas
- [ ] Dashboard com gráficos
- [ ] Sistema de notificações
- [ ] Backup automático
- [ ] Logs de atividades
- [ ] Múltiplos administradores

## Suporte

Para dúvidas ou problemas com a área administrativa frontend:
1. Verifique se o servidor está rodando: `npm run dev`
2. Consulte o console do navegador para erros
3. Verifique a documentação do React e Tailwind CSS
4. Entre em contato com a equipe de desenvolvimento 