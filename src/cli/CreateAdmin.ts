import 'reflect-metadata';
import { container } from '../di/inversify.config';
import { TYPES } from '../di/types';
import { UserRepository } from '../user/application/interface/userRepository';
import PasswordHasher from '../hashing/interface/passwordHasher';
import { User } from '../user/domain/user';

async function createAdmin() {
  console.log('--- Admin Creation Script ---');

  const separatorIndex = process.argv.indexOf('--');
  const args =
    separatorIndex === -1
      ? process.argv.slice(2)
      : process.argv.slice(separatorIndex + 1);
  if (args.length < 5) {
    console.error(
      'Usage: ts-node src/cli/create-admin.ts <name> <email> <password> <documentCPF> <phone> <dateOfBirth>',
    );
    process.exit(1);
  }

  const [name, email, password, documentCPF, phone, dateOfBirth] = args;

  console.log('Resolving dependencies...');
  const userRepo = container.get<UserRepository>(TYPES.UserRepository);
  const passwordHasher = container.get<PasswordHasher>(TYPES.PasswordHasher);

  try {
    console.log(`Checking if user with email ${email} already exists...`);
    const existingUser = await userRepo.getByEmail(email);
    if (existingUser) {
      console.error(`Error: User with email ${email} already exists.`);
      process.exit(1);
    }

    console.log('Hashing password...');
    const hashedPassword = await passwordHasher.hash(password);

    console.log('Creating admin user...');
    const adminUser = User.createAdmin(
      name,
      email,
      documentCPF,
      phone,
      new Date(dateOfBirth),
      hashedPassword,
    );

    console.log('Saving admin to the database...');
    await userRepo.save(adminUser);

    console.log('\n✅ Admin user created successfully!');
    console.log(`   ID: ${adminUser.id}`);
    console.log(`   Name: ${adminUser.name}`);
    console.log(`   Email: ${adminUser.email}`);
  } catch (error) {
    console.error('\n❌ Error creating admin user:');
    console.error(error);
    process.exit(1);
  }
}

createAdmin();
