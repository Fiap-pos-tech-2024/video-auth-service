# video-auth-service

Microsserviço responsável pela autenticação e gerenciamento de usuários do sistema de processamento de vídeos da FIAP X.

## 📊 SonarCloud

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Fiap-pos-tech-2024_video-auth-service&metric=alert_status)](https://sonarcloud.io/dashboard?id=Fiap-pos-tech-2024_video-auth-service)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=Fiap-pos-tech-2024_video-auth-service&metric=coverage)](https://sonarcloud.io/dashboard?id=Fiap-pos-tech-2024_video-auth-service)
[![Maintainability](https://sonarcloud.io/api/project_badges/measure?project=Fiap-pos-tech-2024_video-auth-service&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=Fiap-pos-tech-2024_video-auth-service)

## ✨ Visão Geral

Este serviço permite:

- Registro de novos usuários com nome, e-mail e CPF  
- Armazenamento seguro dos dados em MySQL  
- Integração com AWS Cognito para autenticação e recuperação de senha  
- Login com e-mail e senha  
- Recuperação de senha via código enviado por e-mail  
- Validação de token com retorno dos dados do usuário  
- Exposição de métricas via Prometheus/Grafana  

## 🛠️ Tecnologias Utilizadas

- Node.js + Express  
- Arquitetura Hexagonal (Ports & Adapters)  
- MySQL (via Sequelize)  
- AWS Cognito (SDK v3 + JWT Verify)  
- Docker + Docker Compose  
- Jest para testes unitários  
- SonarCloud para análise de qualidade  
- Prometheus + Grafana para observabilidade  

## 📁 Estrutura do Projeto

```
src/
├── adapters/
│   ├── inbound/      # Controllers, rotas, middlewares
│   └── outbound/     # Repositórios Cognito e MySQL
├── config/           # Configuração de Prometheus
├── domain/           # Entidades (User)
├── ports/            # Interfaces (use cases)
├── usecases/         # Lógica de negócio
└── index.js          # Ponto de entrada da aplicação
```

## 🚀 Como Subir o Serviço Localmente

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
COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
COGNITO_CLIENT_ID=XXXXXXXXXXXXXXXXXXXXXXXXXX
AWS_ACCESS_KEY_ID=XXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
SWAGGER_URL=http://localhost:3000/api
NODE_ENV=local
```

## 📌 Endpoints Principais

### 🔓 Autenticação (`/api/auth`)

- `POST /register` – Cadastra um novo usuário  
- `POST /confirmar-senha` – Define nova senha após o primeiro login  
- `POST /login` – Realiza login com e-mail e senha  
- `POST /recuperar-senha` – Envia código para redefinição de senha  
- `POST /confirmar-recuperacao` – Redefine senha com código recebido  
- `GET  /validate` – Valida o token e retorna dados do usuário (requer JWT)  

### 👤 Usuário (`/api/usuarios`)

- `GET /email/:email` – Consulta usuário por e-mail  
- `GET /cpf/:cpf` – Consulta usuário por CPF  

## ✅ Testes

```bash
# Executar os testes unitários
npm test -- --coverage
```

Cobertura com Jest para AuthController e UserController, incluindo:

- Casos de sucesso  
- Falhas esperadas  
- Erros de entrada  

## 📊 Observabilidade

Este serviço está integrado ao **Grafana Cloud** via **Grafana Alloy**, garantindo monitoramento remoto e escalável com Prometheus hospedado.

- As métricas estão disponíveis na rota `GET /metrics`
- São exportadas automaticamente para o Grafana Cloud após o deploy

### 🔍 Métricas coletadas

- **Métricas padrão** de uso de CPU, memória e eventos Node.js (`prom-client`)
- **Histograma de latência HTTP** com labels por método, rota e status (`http_request_duration_seconds`)

### 📈 Dashboard Grafana Cloud

Visualize o painel de monitoramento em tempo real:

🔗 [Acessar Dashboard](https://fiapmicroservices.grafana.net/d/video-auth-prom/video-auth-service-prometheus?orgId=1&from=now-15m&to=now&timezone=browser&refresh=30s)

> Requer login com conta autorizada na stack `fiapmicroservices`.

### 🛠️ Como funciona

A integração foi feita via:

- `prom-client` no Node.js para expor métricas
- Rota `/metrics` no Express
- Imagem personalizada do **Grafana Alloy** rodando em ECS Fargate
- Alloy envia as métricas diretamente para o **Prometheus remoto** do Grafana Cloud

### 🔐 Segurança

- Apenas o Alloy acessa o endpoint `/metrics` da aplicação
- Tráfego de métrica é autenticado via token gerado no Grafana Cloud 

## ☁️ Deploy na Nuvem (AWS)

Este microsserviço está provisionado e rodando na AWS com a seguinte arquitetura:

- **ECS Fargate**: Execução serverless do container
- **ECR (Elastic Container Registry)**: Armazenamento da imagem Docker
- **ALB (Application Load Balancer)**: Exposição pública das rotas via path `/auth-docs`, `/api/auth`, `/api/usuarios`, `/health`
- **RDS (MySQL)**: Banco de dados relacional
- **Cognito**: Autenticação e gerenciamento de usuários

### CI/CD via GitHub Actions

O pipeline CI/CD está configurado com:

- **Build da imagem Docker**
- **Push para o ECR**
- **Força de novo deploy no ECS Fargate**
- **Integração com SonarCloud**

> O deploy é disparado automaticamente a cada pull request aprovado na branch `main`.

### Acesso em Produção

- **Swagger (Documentação)**: `http://<alb-dns>/auth-docs`
- **Healthcheck**: `http://<alb-dns>/health`
- **APIs públicas**: prefixo `/api/auth` e `/api/usuarios`

## ☁️ SonarCloud

- Análise de qualidade e cobertura automatizada via GitHub Actions  
- Projeto: [`Fiap-pos-tech-2024_video-auth-service`](https://sonarcloud.io/summary/new_code?id=Fiap-pos-tech-2024_video-auth-service)

---

Desenvolvido como parte da Fase 5 do projeto FIAP X.
