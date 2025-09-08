import 'reflect-metadata';
import { instantiateServer } from './infrastructure/http/fastify/Server';

async function start() {
    const { httpServer, configService } = instantiateServer();
    await httpServer.listen(configService.port);
}

start();
