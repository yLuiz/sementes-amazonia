import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateProjectDto, UpdateProjectDto } from './project.dto';

const base = { title: 'Projeto', summary: 'Resumo', content: 'Conteúdo' };

async function parse<T extends object>(cls: new () => T, plain: object) {
  const dto = plainToInstance(cls, plain);
  return { dto, errors: await validate(dto) };
}

describe('is_featured em multipart', () => {
  it('"true" vira verdadeiro', async () => {
    const { dto, errors } = await parse(CreateProjectDto, {
      ...base,
      is_featured: 'true',
    });
    expect(errors).toHaveLength(0);
    expect(dto.is_featured).toBe(true);
  });

  it('"false" vira falso, não verdadeiro', async () => {
    const { dto, errors } = await parse(UpdateProjectDto, {
      is_featured: 'false',
    });
    expect(errors).toHaveLength(0);
    expect(dto.is_featured).toBe(false);
  });

  it('booleano de corpo JSON é aceito', async () => {
    const { dto, errors } = await parse(UpdateProjectDto, {
      is_featured: false,
    });
    expect(errors).toHaveLength(0);
    expect(dto.is_featured).toBe(false);
  });

  it('sem o campo continua indefinido, para não mudar o destaque', async () => {
    const { dto, errors } = await parse(UpdateProjectDto, { title: 'Novo' });
    expect(errors).toHaveLength(0);
    expect(dto.is_featured).toBeUndefined();
  });

  it.each(['', 'TRUE', '1', 'sim', 'on', null, 1])(
    'recusa %p',
    async (value) => {
      const { errors } = await parse(UpdateProjectDto, { is_featured: value });
      expect(errors.map((e) => e.property)).toContain('is_featured');
    },
  );
});

describe('campos com limite no banco', () => {
  it('recusa autor acima de 100 caracteres', async () => {
    const { errors } = await parse(CreateProjectDto, {
      ...base,
      author: 'a'.repeat(101),
    });
    expect(errors.map((e) => e.property)).toContain('author');
  });

  it('recusa data inexistente', async () => {
    const { errors } = await parse(CreateProjectDto, {
      ...base,
      published_at: '2026-02-30',
    });
    expect(errors.map((e) => e.property)).toContain('published_at');
  });

  it('recusa título nulo na edição', async () => {
    const { errors } = await parse(UpdateProjectDto, { title: null });
    expect(errors.map((e) => e.property)).toContain('title');
  });
});
