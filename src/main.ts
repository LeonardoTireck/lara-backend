import 'reflect-metadata';
import 'dotenv/config';
import { instantiateServer } from './infrastructure/http/fastify/Server';

async function start() {
    const httpServer = instantiateServer();
    (await httpServer).listen(+process.env.PORT!);
}

start();
