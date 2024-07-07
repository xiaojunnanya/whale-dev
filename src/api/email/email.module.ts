import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailCode } from './entities/email.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmailCode]),
  ],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
