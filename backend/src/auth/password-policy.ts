export const MIN_PASSWORD_LENGTH = 12;

// O bcrypt ignora o que passa de 72 bytes.
export const MAX_PASSWORD_LENGTH = 72;

// Hash de uma senha aleatória descartada. Precisa ter o mesmo custo dos hashes
// reais, para usuário inexistente levar o mesmo tempo que um existente.
export const DUMMY_PASSWORD_HASH = '$2b$10$XfEitYxoFDtGt8jZoCYbg.vxVjQkVFACx1nBbT9O3wkv4zbofPcby';
