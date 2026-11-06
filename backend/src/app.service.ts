import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

// O pool espera indefinidamente quando o banco para de responder; a checagem não pode travar junto.
const DATABASE_CHECK_TIMEOUT_MS = 3000;

@Injectable()
export class AppService {
  private readonly _logger = new Logger('Health');

  constructor(@InjectDataSource() private readonly _dataSource: DataSource) {}

  getHello(): string {
    return 'NestJS Backend API - Running Successfully!';
  }

  async isDatabaseUp(): Promise<boolean> {
    let timer: NodeJS.Timeout | undefined;
    const timeout = new Promise<never>((_resolve, reject) => {
      timer = setTimeout(() => reject(new Error('Tempo esgotado ao consultar o banco')), DATABASE_CHECK_TIMEOUT_MS);
    });

    try {
      await Promise.race([this._dataSource.query('SELECT 1'), timeout]);
      return true;
    } catch (err: any) {
      this._logger.error(`Banco indisponível: ${err?.message ?? err}`);
      return false;
    } finally {
      clearTimeout(timer);
    }
  }
}
