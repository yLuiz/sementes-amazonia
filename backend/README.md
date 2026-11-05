
# NestJS Backend API

Um back-end completo desenvolvido em NestJS com TypeORM e PostgreSQL, incluindo autenticação JWT, upload de imagens e CRUD completo para Projects e News.

## 🚀 Funcionalidades

- **Autenticação JWT** com login e alteração de senha
- **CRUD completo** para Projects e News
- **Upload de imagens** com validação de formato e tamanho
- **Paginação** em listagens públicas
- **Endpoint público** para servir imagens
- **Validações robustas** com class-validator
- **Estrutura modular** organizada

## 📋 Pré-requisitos

- Node.js (v18+ recomendado)
- PostgreSQL
- npm ou yarn

## 🔧 Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd nestjs-backend
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o banco de dados PostgreSQL**
```bash
# Instalar PostgreSQL (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql postgresql-contrib

# Iniciar serviço
sudo -u postgres pg_ctlcluster 14 main start

# Configurar senha do usuário postgres
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';"

# Criar banco de dados
sudo -u postgres createdb nestjs_backend
```

4. **Configure as variáveis de ambiente**
O arquivo `.env` já está configurado com valores padrão:
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=nestjs_backend

# JWT
JWT_SECRET=gere-um-valor-aleatorio-longo
JWT_EXPIRES_IN=24h

# App
PORT=3000
NODE_ENV=development

# Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

5. **Execute o seed para criar usuário padrão**
```bash
npx ts-node src/scripts/seed.ts
```

6. **Inicie o servidor**
```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

## 📚 Endpoints da API

### 🔐 Autenticação

#### POST /auth/login (público)
Realiza login e grava a sessão em um cookie `HttpOnly`. Toda requisição de escrita precisa do cabeçalho `X-Requested-With: sementes-web`.
```bash
curl -X POST http://localhost:3000/auth/login \
  -c cookies.txt \
  -H "Content-Type: application/json" \
  -H "X-Requested-With: sementes-web" \
  -d '{"username": "SEU_USUARIO", "password": "SUA_SENHA"}'
```

#### GET /auth/me (protegido)
Informa o usuário da sessão atual.

#### POST /auth/logout (público)
Apaga o cookie de sessão.

#### PUT /auth/change-password (protegido)
Altera a senha do usuário autenticado.
```bash
curl -X PUT http://localhost:3000/auth/change-password \
  -H "Content-Type: application/json" \
  -b cookies.txt -H "X-Requested-With: sementes-web" \
  -d '{"oldPassword": "SENHA_ATUAL", "newPassword": "NOVA_SENHA_COM_12_OU_MAIS"}'
```

### 📁 Projects

#### POST /projects (protegido)
Cria um novo projeto.
```bash
curl -X POST http://localhost:3000/projects \
  -b cookies.txt -H "X-Requested-With: sementes-web" \
  -F "nome=Projeto Exemplo" \
  -F "resumo=Um resumo do projeto" \
  -F "descricaoCompleta=Descrição completa do projeto" \
  -F "image=@/path/to/image.jpg"
```

#### GET /projects (público)
Lista projetos com paginação.
```bash
curl "http://localhost:3000/projects?page=1&limit=10"
```

#### GET /projects/:id (público)
Busca um projeto específico.
```bash
curl "http://localhost:3000/projects/1"
```

#### PUT /projects/:id (protegido)
Atualiza um projeto.
```bash
curl -X PUT http://localhost:3000/projects/1 \
  -b cookies.txt -H "X-Requested-With: sementes-web" \
  -F "nome=Projeto Atualizado"
```

#### DELETE /projects/:id (protegido)
Remove um projeto.
```bash
curl -X DELETE http://localhost:3000/projects/1 \
  -b cookies.txt -H "X-Requested-With: sementes-web"
```

### 📰 News

#### POST /news (protegido)
Cria uma nova notícia.
```bash
curl -X POST http://localhost:3000/news \
  -b cookies.txt -H "X-Requested-With: sementes-web" \
  -F "titulo=Título da Notícia" \
  -F "resumo=Resumo da notícia" \
  -F "dataPublicacao=2024-01-01" \
  -F "tags=tag1,tag2,tag3" \
  -F "conteudoCompleto=Conteúdo completo da notícia" \
  -F "image=@/path/to/image.jpg"
```

#### GET /news (público)
Lista notícias com paginação.
```bash
curl "http://localhost:3000/news?page=1&limit=10"
```

#### GET /news/:id (público)
Busca uma notícia específica.
```bash
curl "http://localhost:3000/news/1"
```

#### PUT /news/:id (protegido)
Atualiza uma notícia.
```bash
curl -X PUT http://localhost:3000/news/1 \
  -b cookies.txt -H "X-Requested-With: sementes-web" \
  -F "titulo=Título Atualizado"
```

#### DELETE /news/:id (protegido)
Remove uma notícia.
```bash
curl -X DELETE http://localhost:3000/news/1 \
  -b cookies.txt -H "X-Requested-With: sementes-web"
```

### 🖼️ Media

#### GET /media/:filename (público)
Serve imagens carregadas.
```bash
curl "http://localhost:3000/media/image-filename.jpg"
```

### 🔍 Utilitários

#### GET / (público)
Página inicial da API.
```bash
curl http://localhost:3000/
```

#### GET /health (público)
Status de saúde da aplicação.
```bash
curl http://localhost:3000/health
```

## 📝 Estrutura do Projeto

```
src/
├── auth/                 # Módulo de autenticação
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── jwt.strategy.ts
│   └── jwt-auth.guard.ts
├── config/               # Configurações
│   ├── database.config.ts
│   └── multer.config.ts
├── dto/                  # Data Transfer Objects
│   ├── auth.dto.ts
│   ├── news.dto.ts
│   ├── pagination.dto.ts
│   └── project.dto.ts
├── entities/             # Entidades TypeORM
│   ├── news.entity.ts
│   ├── project.entity.ts
│   └── user.entity.ts
├── media/                # Módulo de mídia
│   ├── media.controller.ts
│   └── media.module.ts
├── news/                 # Módulo de notícias
│   ├── news.controller.ts
│   ├── news.service.ts
│   └── news.module.ts
├── projects/             # Módulo de projetos
│   ├── projects.controller.ts
│   ├── projects.service.ts
│   └── projects.module.ts
├── scripts/              # Scripts utilitários
│   └── seed.ts
├── users/                # Módulo de usuários
│   ├── users.service.ts
│   └── users.module.ts
├── app.controller.ts
├── app.module.ts
├── app.service.ts
└── main.ts
```

## 🛡️ Segurança

- **Sessão por cookie**: Endpoints protegidos exigem o cookie `HttpOnly` criado no login, e escritas exigem o cabeçalho `X-Requested-With`
- **Validação de dados**: Todos os inputs são validados usando class-validator
- **Upload seguro**: Validação de tipo e tamanho de arquivo (máx. 5MB)
- **Formato de imagens**: Apenas JPEG, JPG, PNG e WEBP são aceitos

## 🗃️ Banco de Dados

### Tabelas

#### users
- `id`: Primary key
- `username`: Único, máx. 50 caracteres
- `password`: Hash bcrypt, máx. 255 caracteres
- `createdAt`, `updatedAt`: Timestamps

#### projects
- `id`: Primary key
- `nome`: Máx. 100 caracteres
- `resumo`: Texto
- `imagemThumb`: Path da imagem (opcional)
- `descricaoCompleta`: Texto
- `createdAt`, `updatedAt`: Timestamps

#### news
- `id`: Primary key
- `titulo`: Máx. 150 caracteres
- `resumo`: Texto
- `dataPublicacao`: Data
- `tags`: String separada por vírgulas (opcional)
- `imagemThumb`: Path da imagem (opcional)
- `conteudoCompleto`: Texto
- `createdAt`, `updatedAt`: Timestamps

## 🔑 Usuário Padrão

O seed cria o primeiro administrador a partir de `ADMIN_USERNAME`, `ADMIN_EMAIL` e `ADMIN_PASSWORD` (pelo menos 12 caracteres). Sem elas, ele falha. Se o usuário já existir, nada muda: para trocar a senha, use o painel.

## ⚙️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run start:dev          # Inicia servidor em modo desenvolvimento
npm run build              # Compila para produção
npm run start:prod         # Inicia servidor de produção

# Testes
npm run test               # Executa testes
npm run test:watch         # Executa testes em modo watch
npm run test:e2e           # Executa testes e2e

# Utilitários
npx ts-node src/scripts/seed.ts  # Executa seed do banco
```

## 🐛 Solução de Problemas

### Erro de conexão com PostgreSQL
```bash
# Verificar se PostgreSQL está rodando
sudo -u postgres pg_ctlcluster 14 main status

# Iniciar PostgreSQL
sudo -u postgres pg_ctlcluster 14 main start
```

### Porta 3000 em uso
```bash
# Encontrar processo usando a porta
lsof -i :3000

# Matar processo
pkill -f "nest start"
```

### Erro de permissões na pasta uploads
```bash
# Criar pasta uploads com permissões adequadas
mkdir -p uploads
chmod 755 uploads
```

## 📄 Licença

Este projeto está sob a licença MIT.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

**Desenvolvido com ❤️ usando NestJS, TypeORM e PostgreSQL**
