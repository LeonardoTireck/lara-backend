import { container } from '../../../di/Inversify.config';
import { TYPES } from '../../../di/Types';
import { FastifyAdapter } from './Adapter';
import { Router } from './Routes';

export function instantiateServer() {
    const router = container.get<Router>(TYPES.Router);
    const v1Routes = router.createRoutes();

    const httpServer = new FastifyAdapter();

    httpServer.register(v1Routes, '/v1');

    return httpServer;
}
