import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestRoute } from '../../../application/ports/NestRoute';
import { ErrorHandlerFilter } from './filters/ErrorHandler.filter';

export class NestAdapter {
  private app!: INestApplication;

  constructor(private module: any) {}

  async initialize(): Promise<void> {
    this.app = await NestFactory.create(this.module, {
      logger: ['log', 'error', 'warn', 'debug'],
    });

    this.app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    this.app.useGlobalFilters(new ErrorHandlerFilter());
  }

  public registerRoutes(routes: NestRoute[], prefix: string): void {
    // compatibility with FastifyAdapter
  }

  async listen(port: number): Promise<void> {
    try {
      await this.app.listen(port, '0.0.0.0');
      console.log(`NestJS server is running on http://0.0.0.0:${port}`);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  }

  async close(): Promise<void> {
    await this.app.close();
  }

  getApp(): INestApplication {
    return this.app;
  }
}
