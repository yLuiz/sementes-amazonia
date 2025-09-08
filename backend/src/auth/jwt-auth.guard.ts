
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import envConfig from 'src/config/config';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

    canActivate(context: ExecutionContext) {
        // Se estiver em DEV, ignora autenticação
        if (envConfig().MODE === 'dev') {
            return true;
        }

        // Caso contrário, usa a verificação normal do JWT
        return super.canActivate(context);
    }
}

