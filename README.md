# 🪑 Sistema de Locação de Mesas e Cadeiras  

Projeto desenvolvido para auxiliar no **gerenciamento de aluguéis** de mesas, cadeiras e forros.  
O objetivo é substituir as anotações em papel por um **sistema web responsivo**, acessível pelo celular, com interface simples e prática.  

---

## 🚀 Tecnologias utilizadas
- **Next.js (React)** – Frontend moderno, rápido e componentizado  
- **Firebase**  
  - Firestore → Banco de dados em nuvem  
  - Authentication → Controle de login seguro (mesmo sendo uso interno)  
  - Storage → Armazenamento de arquivos/fotos  
- **Vercel** – Hospedagem e deploy contínuo  
- **React Profiler** – Monitoramento de performance  
- **Lighthouse** – Métricas de qualidade  
  - Performance: 99  
  - Acessibilidade: 87  
  - Best Practices: 100  
  - SEO: 100  

---

## 📱 Funcionalidades
- Cadastro de clientes  
- Registro de aluguéis com: datas de entrega/devolução, valores, distância e status  
- Controle de quantidade de jogos (mesas/cadeiras) e forros  
- Interface **mobile-first**, otimizada para uso no celular  

---

## ⚡ Performance
O sistema foi projetado já pensando em **rapidez e usabilidade**:  
- Carregamento médio de **0.2s** (abaixo do limite de 400ms sugerido pela **Lei de Doherty**)  
- Avaliação excelente no Lighthouse  
- Feedbacks visuais e melhorias contínuas de UX em andamento  

---

## 📦 Como rodar o projeto

```bash
# Clone este repositório
git clone https://github.com/SEU-USUARIO/wdalocacao.git

# Entre na pasta
cd wdalocacao

# Instale as dependências
npm install

# Configure as variáveis de ambiente em `.env.local`
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_ALLOWED_UID=...

# Rode o servidor de desenvolvimento
npm run dev
