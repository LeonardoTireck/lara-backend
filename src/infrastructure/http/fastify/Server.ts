import { container } from '../../../di/Inversify.config';
import { TYPES } from '../../../di/Types';
import { ConfigService } from '../../config/ConfigService';
import { FastifyAdapter } from './Adapter';
import { UserControllers } from './controllers/UserControllers';
import { createRoutes } from './Routes';

export function instantiateServer() {
    const userControllers = container.get<UserControllers>(
        TYPES.UserControllers,
    );
    const configService = container.get<ConfigService>(TYPES.ConfigService);

    const v1Routes = createRoutes(userControllers);
    const httpServer = new FastifyAdapter();

    httpServer.register(v1Routes, '/v1');

    return { httpServer, configService };
}
