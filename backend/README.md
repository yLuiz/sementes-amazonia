
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
JWT_SECRET=super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h

# App
PORT=3000
NODE_ENV=development

# Upload
UPLOAD_DEST=./uploads
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
Realiza login e retorna JWT token.
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

#### PUT /auth/change-password (protegido)
Altera a senha do usuário autenticado.
```bash
curl -X PUT http://localhost:3000/auth/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"oldPassword": "admin123", "newPassword": "newpassword123"}'
```

### 📁 Projects

#### POST /projects (protegido)
Cria um novo projeto.
```bash
curl -X POST http://localhost:3000/projects \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
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
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "nome=Projeto Atualizado"
```

#### DELETE /projects/:id (protegido)
Remove um projeto.
```bash
curl -X DELETE http://localhost:3000/projects/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 📰 News

#### POST /news (protegido)
Cria uma nova notícia.
```bash
curl -X POST http://localhost:3000/news \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
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
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "titulo=Título Atualizado"
```

#### DELETE /news/:id (protegido)
Remove uma notícia.
```bash
curl -X DELETE http://localhost:3000/news/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
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

- **JWT Authentication**: Todos os endpoints protegidos requerem token JWT válido
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

Após executar o seed, um usuário padrão é criado:
- **Username**: `admin`
- **Password**: `admin123`

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
