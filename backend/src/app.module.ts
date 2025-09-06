
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { MediaModule } from './modules/media/media.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { NewsModule } from './modules/news/news.module';
import dataSource from './db/data-source';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dataSource]
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const options = configService.get('typeorm');
        if (!options) {
          throw new Error('TypeORM configuration is missing');
        }
        return options;
      }
    }),
    AuthModule,
    UsersModule,
    ProjectsModule,
    NewsModule,
    MediaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
