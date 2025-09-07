import {
    HttpRequest,
    HttpResponse,
} from '../../../application/ports/HttpServer';
import { CreateUser } from '../../../application/usecases/CreateUser.usecase';
import { FindAllUsers } from '../../../application/usecases/FindAllUsers.usecase';

export class UserControllers {
    constructor(
        private findAllUsersUseCase: FindAllUsers,
        private createUserUseCase: CreateUser,
    ) {}

    getAll = async (request: HttpRequest): Promise<HttpResponse> => {
        const limit = request.query.limit;
        const exclusiveStartKey = request.query.exclusiveStartKey;
        const paginatedOutput = await this.findAllUsersUseCase.execute({
            limit,
            exclusiveStartKey,
        });

        return {
            statusCode: 200,
            body: {
                paginatedOutput,
            },
        };
    };
    newUser = async (req: HttpRequest): Promise<HttpResponse> => {
        const body = req.body;
        body.dateOfBirth = new Date(body.dateOfBirth);
        body.activePlan.startDate = new Date(body.activePlan.startDate);
        body.activePlan.expirationDate = new Date(
            body.activePlan.expirationDate,
        );
        const outputCreateUser = await this.createUserUseCase.execute(body);
        return {
            statusCode: 200,
            body: {
                id: outputCreateUser.id,
                name: outputCreateUser.name,
                email: outputCreateUser.email,
                activePlan: outputCreateUser.activePlan,
            },
        };
    };
}
