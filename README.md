# video-auth-service

Microsserviço responsável pela autenticação e gerenciamento de usuários do sistema de processamento de vídeos da FIAP X.

## ✨ Visão Geral

Este serviço permite:

- Registro de novos usuários com nome, e-mail e CPF
- Armazenamento seguro dos dados em MySQL
- Integração com AWS Cognito para autenticação e recuperação de senha
- Login com e-mail e senha
- Recuperação de senha via código enviado por e-mail

## 🛠️ Tecnologias Utilizadas

- Node.js + Express
- Arquitetura Hexagonal (Ports & Adapters)
- MySQL (via Sequelize)
- AWS Cognito (SDK v3)
- Docker + Docker Compose
- Jest para testes unitários

## 📁 Estrutura do Projeto

```
src/
├── adapters/
│   ├── inbound/      # HTTP Controllers e rotas
│   └── outbound/     # Repositórios Cognito e MySQL
├── config/           # Configuração do banco
├── domain/           # Entidades
├── ports/            # Interfaces
├── usecases/         # Lógica de negócio
└── index.js          # Ponto de entrada da aplicação
```

## 🚀 Como Subir o Serviço

```bash
# 1. Clonar o repositório
git clone https://github.com/Fiap-pos-tech-2024/video-auth-service.git
cd video-auth-service

# 2. Configurar o .env
cp .env.example .env
# Edite as variáveis conforme seu ambiente

# 3. Subir o serviço
docker-compose up --build
```

## 🔐 Variáveis de Ambiente

```env
PORT=3000
MYSQL_HOST=mysql
MYSQL_PORT=3306
MYSQL_USER=fiap
MYSQL_PASSWORD=fiap123
MYSQL_DATABASE=authdb

AWS_REGION=us-east-1
COGNITO_USER_POOL_ID=us-east-1_xxxxx
COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxx
AWS_ACCESS_KEY_ID=xxxxxxxxxxxxxxxxxxxx
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxx
NODE_ENV=local
```

## 📌 Endpoints Principais

- `POST /api/auth/register` – Cadastra um novo usuário
- `POST /api/auth/confirmar-senha` – Define nova senha após registro
- `POST /api/auth/login` – Realiza login com e-mail/senha
- `POST /api/auth/recuperar-senha` – Inicia recuperação de senha
- `POST /api/auth/confirmar-recuperacao` – Confirma nova senha com código
- `GET  /api/usuarios/email/:email` – Consulta usuário por e-mail
- `GET  /api/usuarios/cpf/:cpf` – Consulta usuário por CPF

## ✅ Testes

```bash
# Executar os testes unitários
npx jest
```

## 🧪 Cobertura

Todos os testes do `AuthController` e `UserController` estão implementados com Jest, cobrindo casos de sucesso, erros de input e falhas esperadas.

## 📦 Requisitos Atendidos (FIAP X)

- [x] Microsserviço com autenticação
- [x] Armazenamento seguro dos dados (MySQL)
- [x] Proteção com usuário/senha via Cognito
- [x] Documentação dos endpoints
- [x] Testes unitários
- [x] Pronto para CI/CD via Docker Compose

## 🧱 Futuras Expansões

- Integração com mensageria (RabbitMQ/Kafka)
- CI/CD com GitHub Actions
- Deploy em nuvem (ECS, EKS, etc.)

### Observabilidade

- Para expor métricas Prometheus, o serviço disponibiliza o endpoint `GET /metrics`.
- Métricas padrão do Node.js e histograma de duração de requisições HTTP.

#### Acessando as métricas
   - Prometheus acesse: http://localhost:9090  
   - Grafana acesse: http://localhost:3001  
      - USER: admin
      - SENHA: admin
