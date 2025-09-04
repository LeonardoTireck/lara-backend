import PasswordHasher from '../ports/PasswordHasher';
import { UserRepository } from '../ports/UserRepository';
import { Password } from '../../domain/Password';

export class UpdateClientPersonalInfo {
    constructor(
        private userRepo: UserRepository,
        private passwordHasher: PasswordHasher,
    ) {}
    async execute(input: Input): Promise<void> {
        const user = await this.userRepo.getById(input.id);
        if (!user) throw new Error('User not found.');

        if (input.email) {
            user.updateEmail(input.email);
        }
        if (input.phone) {
            user.updatePhone(input.phone);
        }
        if (input.plainTextPassword) {
            const newPassword = new Password(input.plainTextPassword);
            const newHashedPassword = await this.passwordHasher.hash(
                newPassword.value,
            );
            user.updatePassword(newHashedPassword);
        }
        this.userRepo.update(user);
    }
}

interface Input {
    id: string;
    email?: string;
    plainTextPassword?: string;
    phone?: string;
}
