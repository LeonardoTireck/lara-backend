import { container } from '../../../di/Inversify.config';
import { TYPES } from '../../../di/Types';
import { NestAdapter } from './Adapter';
import { AppModule } from './AppModule';

export async function instantiateNestServer() {
  const httpServer = new NestAdapter(AppModule);
  await httpServer.initialize();

  return httpServer;
}
