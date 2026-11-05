import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/modules/users/users.service';
import { SESSION_COOKIE } from './session-cookie';
import { isSessionVersionValid } from './session-version';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: (req: Request) => req?.cookies?.[SESSION_COOKIE] ?? null,
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findById(payload.sub);
    const secret = this.configService.getOrThrow<string>('JWT_SECRET');
    if (!user || !isSessionVersionValid(payload.sv, user.password, secret)) {
      throw new UnauthorizedException();
    }
    return { id: user.id, username: user.username };
  }
}
