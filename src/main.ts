import 'dotenv/config';
import 'reflect-metadata';
import { instantiateNestServer } from './infrastructure/http/nest/Server';
// import { instantiateServer as instantiateFastifyServer } from './infrastructure/http/fastify/Server';
import { container } from './di/Inversify.config';
import { TYPES } from './di/Types';
import { ConfigService } from './infrastructure/config/ConfigService';

async function start() {
  // const httpServer = instantiateFastifyServer();
  const httpServer = await instantiateNestServer();
  const configService = container.get<ConfigService>(TYPES.ConfigService);
  await httpServer.listen(configService.port);
}

start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
