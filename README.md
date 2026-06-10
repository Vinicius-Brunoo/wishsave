# WishSave // 💰

O **WishSave** é um gerenciador pessoal de lista de desejos e metas de economia financeira. Ele foi construído com uma interface moderna e brutalista para ajudar você a acompanhar visualmente o progresso dos seus sonhos de consumo (eletrônicos, viagens, veículos, etc.) e planejar aportes de forma simples e direta.

---

## ✨ Funcionalidades

- **🔒 Rota Protegida (Guarda de Segurança)**: Apenas usuários autenticados têm acesso ao dashboard e aos cofres.
- **🔑 Autenticação Firebase**: Cadastro e login de usuários via E-mail/Senha ou autenticação instantânea com Google.
- **📊 Painel Geral de Evolução**: Um hero brutalista exibe o percentual acumulado de todas as metas ativas, o total economizado e o restante necessário.
- **📈 Gráficos de Categorias**: Visualização gráfica (via Recharts) das metas versus economia real agrupadas por categoria (Tecnologia, Viagens, Casa, etc.).
- **🏷️ Organização e Prioridades**: Filtre e visualize os itens com base em níveis de prioridade (Alta, Média, Baixa) e cores adaptativas.
- **🏦 Aportes e Retiradas**: Entre nos detalhes de cada meta para simular depósitos (aportes) e resgates (retiradas) com validações em tempo real.
- **💬 Feedback Instantâneo (Toasts)**: Notificações flutuantes confirmam o sucesso ou exibem erros em cada operação.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- **Estilização**: CSS Vanilla (Aesthetics Minimalista/Brutalista)
- **Banco de Dados & Auth**: [Firebase (Firestore & Authentication)](https://firebase.google.com/)
- **Gráficos**: [Recharts](https://recharts.org/)
- **Ícones**: [Lucide React](https://lucide.dev/)
- **Roteamento**: [React Router DOM](https://reactrouter.com/)

---

## 🚀 Como Executar Localmente

### 1. Pré-requisitos
Certifique-se de ter o [Node.js](https://nodejs.org/) instalado na sua máquina.

### 2. Configurar o arquivo `.env`
Duplique o arquivo `.env.example` e renomeie-o para `.env`, preenchendo as credenciais do seu projeto Firebase:
```bash
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
VITE_FIREBASE_MEASUREMENT_ID=seu_measurement_id
```

### 3. Instalar dependências e iniciar o servidor
```bash
# Instalar dependências
npm install

# Iniciar em modo de desenvolvimento
npm run dev
```
O projeto estará disponível por padrão em `http://localhost:5173`.

---

## ☁️ Deploy no Vercel

O projeto está configurado para publicação instantânea na Vercel utilizando regras de reescrita para Single Page Applications (SPA). 

Durante o import do repositório no painel da Vercel, basta adicionar as variáveis de ambiente descritas acima.
