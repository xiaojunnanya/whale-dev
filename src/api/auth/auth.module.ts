import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { TOKEN } from '@/config';

@Module({
  imports:[
    JwtModule.register({
      global: true,
      secret: TOKEN.secret,
      signOptions: { expiresIn: TOKEN.expiresIn },
    })
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
