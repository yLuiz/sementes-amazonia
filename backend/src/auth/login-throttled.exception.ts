import { HttpException, HttpStatus } from '@nestjs/common';

export class LoginThrottledException extends HttpException {
  constructor(readonly retryAfterSeconds: number) {
    super(
      {
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        message: 'Muitas tentativas de login. Tente novamente em alguns minutos.',
        error: 'Too Many Requests',
      },
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}
