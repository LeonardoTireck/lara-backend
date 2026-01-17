import 'dotenv/config';
import 'reflect-metadata';
import { instantiateServer as instantiateFastifyServer } from './fastify/server';
import { container } from './di/inversify.config';
import { TYPES } from './di/types';
import { ConfigService } from './config/configService';

async function start() {
  const httpServer = instantiateFastifyServer();
  const configService = container.get<ConfigService>(TYPES.ConfigService);
  await httpServer.listen(configService.port);
}

start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
