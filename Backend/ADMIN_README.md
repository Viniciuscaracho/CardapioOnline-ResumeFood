# Área Administrativa - Cheiro Verde

## Visão Geral

A área administrativa permite que o dono do site gerencie produtos e controle os pedidos que estão chegando. Ela está localizada em `/admin` e requer autenticação de administrador.

## Acesso

### Credenciais de Administrador
- **Email:** admin@cheiroverde.com
- **Senha:** admin123

### Como Acessar
1. Acesse `http://localhost:3000/admin`
2. Faça login com as credenciais acima
3. Você será redirecionado para o dashboard administrativo

## Funcionalidades

### Dashboard (`/admin`)
- **Estatísticas Gerais:** Total de produtos, pedidos e pedidos pendentes
- **Pedidos Recentes:** Lista dos 5 pedidos mais recentes
- **Produtos Recentes:** Lista dos 5 produtos mais recentes

### Gerenciamento de Produtos (`/admin/products`)

#### Listar Produtos
- Visualize todos os produtos cadastrados
- Veja informações como nome, categoria, preço e status de disponibilidade
- Ações disponíveis: Ver detalhes, Editar, Excluir

#### Criar Novo Produto
- Clique em "Novo Produto" na página de listagem
- Preencha os campos:
  - **Nome:** Nome do produto
  - **Categoria:** Categoria do produto (ex: Hambúrgueres, Bebidas)
  - **Descrição:** Descrição detalhada do produto
  - **Preço:** Preço em reais (use vírgula para decimais)
  - **URL da Imagem:** Link para imagem do produto (opcional)
  - **Disponível:** Checkbox para marcar se o produto está disponível

#### Editar Produto
- Clique em "Editar" na listagem de produtos
- Modifique os campos desejados
- Clique em "Atualizar Produto"

#### Excluir Produto
- Clique em "Excluir" na listagem de produtos
- Confirme a exclusão

### Gerenciamento de Pedidos (`/admin/orders`)

#### Listar Pedidos
- Visualize todos os pedidos recebidos
- Informações exibidas:
  - Número do pedido
  - Nome e endereço do cliente
  - Telefone e email
  - Valor total
  - Status do pedido
  - Data do pedido

#### Status dos Pedidos
- **Pendente:** Pedido recebido, aguardando confirmação
- **Confirmado:** Pedido confirmado pelo estabelecimento
- **Em Preparação:** Pedido sendo preparado
- **Pronto:** Pedido pronto para entrega
- **Entregue:** Pedido entregue ao cliente

#### Editar Pedido
- Clique em "Editar" na listagem de pedidos
- Modifique as informações:
  - Dados do cliente (nome, telefone, email, endereço)
  - Status do pedido
  - Valor total
  - Observações

#### Ver Detalhes do Pedido
- Clique em "Ver" na listagem de pedidos
- Visualize:
  - Informações completas do cliente
  - Status e valor do pedido
  - Lista de itens do pedido com quantidades e preços
  - Observações do pedido

## Navegação

### Menu Principal
- **Dashboard:** Página inicial administrativa
- **Produtos:** Gerenciamento de produtos
- **Pedidos:** Gerenciamento de pedidos
- **Sair:** Logout da área administrativa

### Botões de Ação
- **Ver:** Visualizar detalhes
- **Editar:** Modificar informações
- **Excluir:** Remover item (com confirmação)
- **Cancelar:** Voltar à listagem
- **Salvar:** Confirmar alterações

## Segurança

- Apenas usuários com `admin = true` podem acessar a área administrativa
- Todas as páginas administrativas requerem autenticação
- Tentativas de acesso sem autorização são redirecionadas para a página inicial

## Personalização

### Adicionar Novos Administradores
1. Acesse o console Rails: `rails console`
2. Crie um novo usuário administrador:
```ruby
User.create!(
  email: 'novo@admin.com',
  password: 'senha123',
  password_confirmation: 'senha123',
  admin: true
)
```

### Modificar Status de Pedidos
Os status disponíveis podem ser modificados no controller `Admin::OrdersController` e nas views correspondentes.

## Suporte

Para dúvidas ou problemas com a área administrativa, consulte a documentação do Rails ou entre em contato com a equipe de desenvolvimento. 