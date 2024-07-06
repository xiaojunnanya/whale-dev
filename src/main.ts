import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from '@/common/expection/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 捕获class-validator抛出的异常
  app.useGlobalPipes(new ValidationPipe({
    exceptionFactory: (validationErrors = []) => {

      const formattedErrors = validationErrors.reduce((acc, error) => {
        acc[error.property] = Object.values(error.constraints)
        return acc;
      }, {});

      return new HttpException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: formattedErrors,
      }, HttpStatus.BAD_REQUEST);
    },
  }));

  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(3001);
}
bootstrap();
