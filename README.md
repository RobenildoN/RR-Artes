# 🎨 RR Artes - Sistema de Gestão e E-commerce

<p align="center">
  <img src="public/Logo RR Artes.png" alt="RR Artes Logo" width="200" />
</p>

Bem-vindo ao repositório da **RR Artes**! Este é um sistema web moderno desenvolvido para gerenciar as operações de uma loja local em Hortolândia, abrangendo desde a venda de produtos de papelaria até a solicitação de orçamentos para serviços personalizados.

---

## 🚀 Sobre o Projeto

O projeto **RR Artes** foi concebido para digitalizar e otimizar os processos da loja, oferecendo uma experiência fluida para os clientes e uma ferramenta poderosa de gestão para os administradores.

### 🛠️ Funcionalidades Principais

- **🛍️ Papelaria Online:** Catálogo completo de produtos com carrinho de compras integrado.
- **🧵 Sistema de Orçamentos:** Formulário dedicado para pedidos de bordados e consertos de roupas, com suporte a anexos (fotos/PDF).
- **👤 Área do Cliente:** Autenticação segura para realização de compras e acompanhamento.
- **🚚 Logística Inteligente:** Cálculo automático para retirada na loja ou entrega (com validação de distância).
- **🔐 Painel Administrativo:** Gestão total de produtos, pedidos e solicitações de orçamento.
- **📱 Responsividade:** Interface adaptada para dispositivos móveis, tablets e desktops.
- **💬 Atendimento Direto:** Integração com WhatsApp para suporte rápido.

---

## 💻 Tecnologias Utilizadas

O sistema utiliza o que há de mais moderno no ecossistema JavaScript/TypeScript:

| Tecnologia       | Descrição                                                        |
| :--------------- | :--------------------------------------------------------------- |
| **Next.js 15+**  | Framework React com App Router para SSR e performance otimizada. |
| **React 19**     | Biblioteca principal para construção da interface.               |
| **TypeScript**   | Tipagem estática para maior segurança e produtividade.           |
| **Tailwind CSS** | Estilização moderna e responsiva baseada em utilitários.         |
| **Prisma ORM**   | Interface intuitiva para comunicação com o banco de dados.       |
| **PostgreSQL**   | Banco de dados relacional robusto e escalável.                   |
| **Nodemailer**   | Serviço para envio de e-mails de orçamento e notificações.       |
| **Lucide React** | Conjunto de ícones leves e elegantes.                            |

---

## 📂 Estrutura do Código

A arquitetura segue os padrões modernos do Next.js:

```bash
src/
├── app/            # Rotas, páginas e APIs (App Router)
│   ├── admin/      # Painel administrativo
│   ├── api/        # Endpoints da API (Auth, Produtos, Pedidos)
│   ├── carrinho/   # Fluxo de finalização de compra
│   └── orcamento/  # Sistema de solicitações de serviço
├── components/     # Componentes React reutilizáveis
│   ├── common/     # Componentes genéricos (Botões, Inputs)
│   └── layout/     # Estruturas fixas (Navbar, Footer)
├── context/        # Gerenciamento de estado (Auth, Cart, Theme)
├── lib/            # Configurações e utilitários (DB, Auth, Email)
└── prisma/         # Schema do banco de dados e scripts de seed
```

---

## 🛠️ Como Executar Localmente

Siga o passo a passo abaixo para rodar o projeto em sua máquina:

### 1. Pré-requisitos

- Node.js (v20 ou superior)
- PostgreSQL instalado ou um container Docker
- Gerenciador de pacotes (npm, yarn ou pnpm)

### 2. Instalação

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/seu-usuario/rr-artes.git
cd rr-artes
npm install
```

### 3. Configuração de Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto e configure as seguintes variáveis:

```env
# Banco de Dados
DATABASE_URL="postgresql://usuario:senha@localhost:5432/rr_artes"

# Autenticação
JWT_SECRET="sua_chave_secreta_aqui"

# E-mail (SMTP)
SMTP_HOST="smtp.exemplo.com"
SMTP_PORT=587
SMTP_USER="seu-email@exemplo.com"
SMTP_PASS="sua-senha"
```

### 4. Banco de Dados

Execute as migrações para criar as tabelas e popule o banco com dados iniciais:

```bash
# Criar tabelas
npx prisma migrate dev --name init

# (Opcional) Popular o banco de dados
node prisma/seed.js
```

### 5. Execução

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O projeto estará disponível em [http://localhost:3000](http://localhost:3000) 🚀

---

## 📧 Contato

Para mais informações ou suporte:

- **Empresa:** RR Artes
- **Localização:** Hortolândia - SP
- **WhatsApp:** [Clique aqui para conversar](https://wa.me/seunumerodewhatsapp)

---

<p align="center">
  Desenvolvido com ❤️ para a RR Artes.
</p>
