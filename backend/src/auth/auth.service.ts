import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginDto, ChangePasswordDto } from '../dto/auth.dto';
import { UsersService } from 'src/modules/users/users.service';
import { LoginAttemptsService } from './login-attempts.service';
import { LoginThrottledException } from './login-throttled.exception';
import { DUMMY_PASSWORD_HASH } from './password-policy';
import { sessionVersion } from './session-version';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private loginAttempts: LoginAttemptsService,
  ) {}

  async login(loginDto: LoginDto) {
    const retryAfterSeconds = this.loginAttempts.acquire(loginDto.username);
    if (retryAfterSeconds > 0) {
      throw new LoginThrottledException(retryAfterSeconds);
    }

    let user: Awaited<ReturnType<UsersService['findByUsername']>>;
    let isPasswordValid: boolean;
    try {
      user = await this.usersService.findByUsername(loginDto.username);
      // Usuário inexistente também compara, para a resposta não revelar quais existem.
      isPasswordValid = await bcrypt.compare(loginDto.password, user?.password ?? DUMMY_PASSWORD_HASH);
    } catch (error) {
      // Falha do servidor não é tentativa errada de quem está tentando entrar.
      this.loginAttempts.release(loginDto.username);
      throw error;
    }

    if (!user || !isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    this.loginAttempts.reset(loginDto.username);

    return {
      ...this.issueSession(user.id, user.username, user.password),
      user: {
        id: user.id,
        username: user.username,
      },
    };
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    // 400, não 401: errar a senha atual não significa que a sessão acabou.
    const isOldPasswordValid = await bcrypt.compare(
      changePasswordDto.oldPassword,
      user.password,
    );
    if (!isOldPasswordValid) {
      throw new BadRequestException('Senha atual incorreta');
    }

    if (changePasswordDto.newPassword === changePasswordDto.oldPassword) {
      throw new BadRequestException('A nova senha precisa ser diferente da atual');
    }

    const hashedNewPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
    await this.usersService.updatePassword(userId, hashedNewPassword);

    // O token novo mantém esta sessão; as outras caem porque o `sv` delas mudou.
    return {
      ...this.issueSession(user.id, user.username, hashedNewPassword),
      message: 'Senha alterada com sucesso',
    };
  }

  private issueSession(userId: number, username: string, passwordHash: string) {
    const token = this.jwtService.sign({
      username,
      sub: userId,
      sv: sessionVersion(passwordHash, this.configService.getOrThrow<string>('JWT_SECRET')),
    });
    const { exp } = this.jwtService.decode<{ exp: number }>(token);

    return { token, expires: new Date(exp * 1000) };
  }
}
