import { FastifyAdapter } from './api';
import {
    HttpRequest,
    HttpResponse,
} from '../../../application/ports/HttpServer';

async function startServer() {
    const httpServer = new FastifyAdapter();

    httpServer.on('get', '/', helloWorld, []);

    await httpServer.listen(3001);
}

async function helloWorld(req: HttpRequest): Promise<HttpResponse> {
    return {
        statusCode: 200,
        body: 'Hello World',
    };
}

startServer();
