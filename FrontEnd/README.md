# Cheiro Verde - Frontend

Sistema de delivery e gestão de pedidos para o restaurante Cheiro Verde Nutriservice.

## 🚀 Funcionalidades

### Página Inicial
- **Status da loja** - Mostra se está aberta/fechada
- **Horário de funcionamento** - Exibe horários de atendimento
- **Informações de entrega** - Tempo estimado de entrega
- **Contatos diretos** - WhatsApp e telefone com links funcionais
- **Endereço completo** - Localização do estabelecimento
- **Navegação para menu e pedidos**

### Cardápio
- **Menu categorizado** - Lanches, acompanhamentos, bebidas, saladas
- **Filtros por categoria** - Navegação fácil entre tipos de produtos
- **Carrinho de compras** - Adicionar/remover itens
- **Imagens dos produtos** - Visualização atrativa
- **Preços e descrições** - Informações completas
- **Status de disponibilidade** - Produtos disponíveis/indisponíveis

### Gestão de Pedidos
- **Histórico de pedidos** - Lista completa de pedidos
- **Busca avançada** - Por número, nome ou telefone
- **Status dos pedidos** - Entregue, preparando, cancelado
- **Detalhes completos** - Itens, valores, informações do cliente
- **Contatos diretos** - WhatsApp e telefone para cada pedido
- **Tempo estimado de entrega** - Para pedidos em preparação

## 🛠️ Tecnologias Utilizadas

- **React 19** - Framework principal
- **Vite** - Build tool e dev server
- **React Router DOM** - Navegação entre páginas
- **Tailwind CSS** - Estilização e responsividade
- **Lucide React** - Ícones
- **Shadcn/ui** - Componentes UI
- **Framer Motion** - Animações

## 📱 Responsividade

O sistema é totalmente responsivo e funciona perfeitamente em:
- 📱 **Mobile** (320px+)
- 📱 **Tablet** (768px+)
- 💻 **Desktop** (1024px+)

## 🎨 Design System

### Cores Principais
- **Verde** (#16a34a) - Ações principais, disponibilidade
- **Azul** (#3b82f6) - Informações, contatos
- **Laranja** (#f97316) - Menu, destaque
- **Roxo** (#8b5cf6) - Pedidos, secundário

### Componentes
- **Cards** - Para produtos e pedidos
- **Badges** - Status e categorias
- **Buttons** - Ações e navegação
- **Inputs** - Busca e formulários

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação
```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

### Acessar
O projeto estará disponível em: `http://localhost:5173`

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── ui/           # Componentes base (shadcn/ui)
│   └── Navigation.jsx # Navegação principal
├── pages/
│   ├── HomePage.jsx   # Página inicial
│   ├── MenuPage.jsx   # Cardápio
│   └── OrdersPage.jsx # Gestão de pedidos
├── assets/
│   └── cheiro_verde_logo.png
├── App.jsx           # Componente principal
├── main.jsx         # Entry point
└── index.css        # Estilos globais
```

## 🔧 Configurações

### Vite
- Hot reload ativado
- Build otimizado para produção
- Suporte a JSX e TypeScript

### Tailwind CSS
- Configuração customizada
- Variáveis CSS para temas
- Componentes utilitários

## 📱 Funcionalidades Mobile

- **Touch-friendly** - Botões com tamanho mínimo de 44px
- **Swipe gestures** - Navegação intuitiva
- **Responsive images** - Otimizadas para diferentes telas
- **Mobile-first** - Design pensado primeiro para mobile

## 🔗 Integração com Backend

O frontend está preparado para integração com API REST:
- **Endpoints** - Configurados para Rails API
- **CORS** - Configurado para comunicação cross-origin
- **JSON** - Formato de dados padrão

## 🎯 Próximos Passos

- [ ] Integração com backend Rails
- [ ] Sistema de autenticação
- [ ] Carrinho persistente (localStorage)
- [ ] Notificações push
- [ ] PWA (Progressive Web App)
- [ ] Testes automatizados
- [ ] Deploy automatizado

## 📞 Suporte

Para dúvidas ou sugestões, entre em contato:
- **WhatsApp**: (46) 98820-3174
- **Telefone**: (46) 3536-2525

---

Desenvolvido com ❤️ para o Cheiro Verde Nutriservice 