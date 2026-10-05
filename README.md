# 🪑 Sistema de Locação de Mesas e Cadeiras  

Projeto desenvolvido para auxiliar no **gerenciamento de aluguéis** de mesas, cadeiras e forros.  
O objetivo é substituir as anotações em papel por um **sistema web responsivo**, acessível pelo celular, com interface simples e prática.  

---

## 🚀 Tecnologias utilizadas
- **Next.js (React)** – Frontend moderno, rápido e componentizado  
- **Firebase**  
  - Firestore → Banco de dados em nuvem  
  - Authentication → Controle de login seguro (mesmo sendo uso interno)  
- **Vercel** – Hospedagem e deploy contínuo  

---

## 📱 Funcionalidades
- Cadastro de clientes  
- Registro de aluguéis com: datas de entrega/devolução, valores, distância e status  
- Controle de quantidade de jogos (mesas/cadeiras) e forros  
- Interface **mobile-first**, otimizada para uso no celular  

---

## Publicação

O sistema está disponível em https://wdalocacao.vercel.app. As variáveis de
ambiente são configuradas separadamente na Vercel; não fazem parte do Git.
Next.js e eslint-config-next estão fixados em 15.5.27, e React e React DOM em 19.3.0.

---

## 📦 Como rodar o projeto

```bash
# Clone este repositório
git clone https://github.com/GabrielProzin/wdalocacao.git

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
```

### Ambiente local no Windows

O projeto deve ser executado na raiz `C:\Projetos\wdalocacao`, onde está o
`package.json`. No PowerShell, utilize `npm.cmd` se a execução de `npm.ps1`
estiver bloqueada:

```powershell
cd C:\Projetos\wdalocacao
npm.cmd install
npm.cmd run dev
```

Abra http://localhost:3000/login. Preencha `.env.local` com a configuração do
aplicativo Web do Firebase, encontrada em **Configurações do projeto > Seus apps**.
Os seis campos de `firebaseConfig` correspondem às variáveis `NEXT_PUBLIC_FIREBASE_*`
do exemplo acima. Em **Authentication > Users**, copie o UID do usuário para
`NEXT_PUBLIC_ALLOWED_UID`. O login utiliza email/senha.

Para autorizar outros usuários, use `NEXT_PUBLIC_ALLOWED_UIDS` com UIDs separados
por vírgulas. `NEXT_PUBLIC_FIRESTORE_LONG_POLLING=false` é o padrão; use `true`
somente se precisar contornar problemas de conexão com o Firestore.

Reinicie o servidor após alterar `.env.local`. Esse arquivo está ignorado pelo
Git. Senhas de login e chaves privadas de serviço não pertencem a esse arquivo.
Use o projeto Firebase existente para manter acesso aos dados antigos; as regras
do Firestore também precisam permitir acesso ao usuário autorizado.

## Fluxo de uso

- `/home`: visão geral com período mensal, valores contratados, aluguéis em
  aberto, jogos em uso e agenda de entregas/devoluções.
- `/Aluguel/New`: cadastro em três etapas (cliente e itens, entrega, revisão).
  Os campos, o modelo de dados e os preços originais foram mantidos:
  R$ 15 por jogo e R$ 5 por forro.
- `/Aluguel/List`: busca por cliente/telefone/endereço, filtro de status e mês,
  edição e avanço do status para entregue ou devolvido.
- `/Aluguel/Edit/[id]`: mesmo formulário de cadastro, preenchido com os dados
  existentes. Datas e horários opcionais podem permanecer vazios.

O dashboard agrupa os valores pelo mês da entrega. São **valores contratados**,
incluindo frete; o sistema ainda não registra pagamentos, despesas ou lucro.
Jogos em uso correspondem aos aluguéis com status `entregue`; não há estoque
total fictício. Agenda e aluguéis em aberto consideram todos os meses.

Os dados da coleção `aluguel` são compartilhados entre as telas por uma única
assinatura do Firestore. Não há truncamento em 50 ou 500 registros. O cache é
em memória para evitar conflitos de persistência entre abas; após recarregar,
é necessária conexão para consultar o histórico. O formulário mantém seus
valores durante uma falha de salvamento e permite tentar novamente.

### Verificações

```powershell
npm.cmd test -- --configLoader runner
npm.cmd run lint
npx.cmd tsc --noEmit
npm.cmd run build
npm.cmd run format
```

Pare o servidor de desenvolvimento antes de gerar o build, pois ambos usam a
pasta `.next`. Não se deve adicionar `.env.local` ao Git.

Se o login funcionar e aparecer erro de permissão nos aluguéis, confira as regras
da coleção `aluguel` no Firestore para o UID autorizado. A variável
`NEXT_PUBLIC_ALLOWED_UID` controla a interface, mas não altera as regras do banco.

### Revisão de uso

A revisão de outubro de 2026 validou cadastro, edição, persistência após reload,
entrega, devolução e atualização do dashboard no Firebase configurado. A exclusão
pede confirmação dentro da página e permite cancelar. Erros de gravação, exclusão
e mudança de status distinguem falhas de rede, sessão e permissão.

O layout foi conferido nas larguras de 360, 390, 430 e 1280 pixels. Em telas até
480 pixels, datas e horários ocupam linhas separadas, e os botões do formulário
não cobrem os campos. A emulação ainda deve ser complementada pelo teste em
celular físico. A suíte conta com 28 testes automatizados.

O login mantém a sessão no navegador e permite preenchimento por gerenciador de
senhas. Para criar a conta definitiva, cadastre o usuário no Authentication,
libere seu UID nas regras do Firestore e nas variáveis de acesso da Vercel, e
publique novamente. Nunca inclua a senha no código.
