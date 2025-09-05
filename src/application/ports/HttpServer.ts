export interface HttpRequest {
    body?: any;
    params?: any;
    headers?: any;
    query?: any;
    cookies?: any;
}

export interface HttpResponse {
    statusCode: number;
    body: any;
}

export type Controller = (request: HttpRequest) => Promise<HttpResponse>;

export type Middleware = (request: HttpRequest) => Promise<void>;

export interface HttpServer {
    on(
        method: 'get' | 'post' | 'put' | 'delete',
        path: string,
        controller: Controller,
        middlewares?: Middleware[],
    ): void;
    listen(port: number): Promise<void>;
}
