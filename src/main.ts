import 'dotenv/config';
import 'reflect-metadata';
import { instantiateServer } from './infrastructure/http/fastify/Server';
import { container } from './di/Inversify.config';
import { TYPES } from './di/Types';
import { ConfigService } from './infrastructure/config/ConfigService';

async function start() {
  const httpServer = instantiateServer();
  const configService = container.get<ConfigService>(TYPES.ConfigService);
  await httpServer.listen(configService.port);
}

start();
