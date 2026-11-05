import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

// Maior valor da coluna `integer`; acima disso o banco falharia e a resposta seria 500.
const MAX_ID = 2_147_483_647;

/**
 * Recebe número porque o ValidationPipe global converte o parâmetro antes
 * (`abc` chega aqui como NaN). O texto cobre o uso fora desse fluxo.
 */
@Injectable()
export class ParseIdPipe implements PipeTransform<unknown, number> {
  transform(value: unknown): number {
    const id =
      typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : value;

    if (
      typeof id !== 'number' ||
      !Number.isInteger(id) ||
      id < 1 ||
      id > MAX_ID
    ) {
      throw new BadRequestException('ID inválido');
    }

    return id;
  }
}
