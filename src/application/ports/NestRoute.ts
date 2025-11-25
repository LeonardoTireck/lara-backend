export interface NestRoute {
  method: 'get' | 'post' | 'put' | 'delete' | 'patch';
  path: string;
  handler: (...args: any[]) => Promise<any>;
  guards?: any[];
  middlewares?: any[];
}
