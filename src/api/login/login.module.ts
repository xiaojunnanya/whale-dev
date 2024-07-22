import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
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
  controllers: [LoginController],
  providers: [LoginService],
})
export class LoginModule {}
