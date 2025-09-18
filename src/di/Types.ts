export const TYPES = {
  //config
  ConfigService: Symbol.for('ConfigService'),
  DynamoDBClient: Symbol.for('DynamoDBClient'),
  //utils
  PasswordHasher: Symbol.for('PasswordHasher'),
  JwtService: Symbol.for('JwtService'),
  //repos
  UserRepository: Symbol.for('UserRepository'),
  RefreshTokenRepository: Symbol.for('RefreshTokenRepository'),
  VideoMetadataRepository: Symbol.for('VideoMetadataRepository'),
  //storage
  VideoStorage: Symbol.for('VideoStorage'),
  //useCases
  FindAllUsersUseCase: Symbol.for('FindAllUsersUseCase'),
  CreateUserUseCase: Symbol.for('CreateUserUseCase'),
  LoginUseCase: Symbol.for('LoginUseCase'),
  RefreshTokenUseCase: Symbol.for('RefreshTokenUseCase'),
  LogoutUseCase: Symbol.for('LogoutUseCase'),
  //controllers
  UserControllers: Symbol.for('UserControllers'),
  ServerControllers: Symbol.for('ServerControllers'),
  //routes
  Router: Symbol.for('Router'),
  //middlewares
  AuthMiddleware: Symbol.for('AuthMiddleware'),
};
