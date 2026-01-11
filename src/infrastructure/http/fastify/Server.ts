import { container } from '../../../di/inversify.config';
import { TYPES } from '../../../di/types';
import { FastifyAdapter } from './adapter';
import { Router } from './routes';

export function instantiateServer() {
  const router = container.get<Router>(TYPES.Router);
  const v1Routes = router.createRoutes();

  const httpServer = new FastifyAdapter();

  httpServer.register(v1Routes, '/v1');

  return httpServer;
}
