# Instruções para Integração com API Real

## 📋 Passos para migrar dos dados mockados para API real:

### 1. **Configurar ambiente**
```typescript
// src/app/config/api.config.ts
export const environment = {
  production: false,
  useMockData: false, // ← Alterar para false
  apiUrl: 'https://sua-api-real.com', // ← URL real da API
  apiVersion: 'v1'
};
```

### 2. **Atualizar ProjectsService**
```typescript
// src/app/services/projects.service.ts
import { ProjectsHttpService } from './projects-http.service';

constructor(private httpService: ProjectsHttpService) { }

getProjects(): Observable<Project[]> {
  if (environment.useMockData) {
    return of(this.mockProjects);
  }
  return this.httpService.getProjects(); // ← Usar HTTP service
}
```

### 3. **Verificar endpoints da API**
O `ProjectsHttpService` já está configurado com os seguintes endpoints:
- `GET /projects` - Listar todos os projetos
- `GET /projects/:id` - Buscar projeto por ID
- `GET /projects/featured` - Projetos em destaque
- `POST /projects` - Criar novo projeto
- `PUT /projects/:id` - Atualizar projeto
- `DELETE /projects/:id` - Deletar projeto

### 4. **Testar integração**
1. Certificar-se de que a API está funcionando
2. Alterar `useMockData` para `false`
3. Testar todas as funcionalidades
4. Verificar tratamento de erros

### 5. **Estrutura esperada da API**
```json
{
  "id": 1,
  "image": "url-da-imagem",
  "title": "Título do Projeto",
  "date": "31 de Maio de 2025",
  "description": "Descrição do projeto..."
}
```

### 6. **Tratamento de Erros**
O serviço já inclui tratamento básico de erros. Considere adicionar:
- Loading states
- Retry logic
- Notificações de erro para o usuário
- Fallback para dados mockados em caso de falha

## 📁 Arquivos envolvidos:
- `src/app/services/projects.service.ts` - Serviço principal
- `src/app/services/projects-http.service.ts` - Comunicação HTTP
- `src/app/config/api.config.ts` - Configuração de ambiente
- `src/app/app.config.ts` - Configuração do HttpClient (já feito)

## 🔧 Recursos já implementados:
- ✅ HttpClient configurado
- ✅ Serviço HTTP pronto
- ✅ Interface TypeScript definida
- ✅ Testes unitários
- ✅ Tratamento de erros básico
- ✅ Paginação (preparada)
- ✅ Projetos em destaque
