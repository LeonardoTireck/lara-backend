import {
  FindAllUsers,
  FindAllUsersInput,
} from "../../../src/application/usecases/FindAllUsers.usecase";
import { TrainingPlan } from "../../../src/domain/TrainingPlan";
import { User } from "../../../src/domain/User";
import { InMemoryUserRepo } from "../../../src/infrastructure/UserRepo/InMemory";

class PaginatedInMemoryUserRepo extends InMemoryUserRepo {
  async getAll(limit: number, exclusiveStartKey?: Record<string, any>) {
    if (limit <= 0) {
      return {
        users: [],
        lastEvaluatedKey: undefined,
      };
    }
    const startIndex = exclusiveStartKey ? exclusiveStartKey.index : 0;
    const endIndex = startIndex + limit;
    const usersSlice = this.users.slice(startIndex, endIndex);
    let lastEvaluatedKey;
    if (endIndex < this.users.length) {
      lastEvaluatedKey = { index: endIndex };
    }
    return {
      users: usersSlice,
      lastEvaluatedKey: lastEvaluatedKey,
    };
  }
}

describe("FindAllUsers Use Case Test", () => {
  let repo: PaginatedInMemoryUserRepo;
  let useCaseFindAllUsers: FindAllUsers;

  const testUsersData = [
    { name: "User Alpha", cpf: "11144477735", phone: "11987654321" },
    { name: "User Beta", cpf: "98765432100", phone: "11912345678" },
    { name: "User Gamma", cpf: "12345678909", phone: "11988887777" },
  ];

  beforeEach(async () => {
    repo = new PaginatedInMemoryUserRepo();
    useCaseFindAllUsers = new FindAllUsers(repo);

    for (let i = 0; i < testUsersData.length; i++) {
      const userData = testUsersData[i];
      const user = User.create(
        userData.name,
        `testuser${i}@example.com`,
        userData.cpf,
        userData.phone,
        new Date(`1990-01-0${i + 1}`),
        `hashedpass${i}`,
        TrainingPlan.create("silver", "card"),
        "client",
      );
      await repo.save(user);
    }
  });

  it("should return the first page of users", async () => {
    const input: FindAllUsersInput = { limit: 2 };
    const output = await useCaseFindAllUsers.execute(input);

    expect(output.users).toHaveLength(2);
    expect(output.users[0].name).toBe("User Alpha");
    expect(output.users[0].email).toBe("testuser0@example.com");
    expect(output.users[1].name).toBe("User Beta");
    expect(output.users[1].email).toBe("testuser1@example.com");
    expect(output.lastEvaluatedKey).toBeDefined();
  });

  it("should return the second page of users", async () => {
    const input: FindAllUsersInput = {
      limit: 2,
      exclusiveStartKey: { index: 2 },
    };
    const output = await useCaseFindAllUsers.execute(input);

    expect(output.users).toHaveLength(1);
    expect(output.users[0].name).toBe("User Gamma");
    expect(output.users[0].email).toBe("testuser2@example.com");
    expect(output.lastEvaluatedKey).toBeUndefined();
  });

  it("should return an empty array when the repository is empty", async () => {
    repo.users = []; // Clear the repository
    const input: FindAllUsersInput = { limit: 5 };
    const output = await useCaseFindAllUsers.execute(input);

    expect(output.users).toHaveLength(0);
    expect(output.lastEvaluatedKey).toBeUndefined();
  });

  it("should return all users when limit is greater than total users", async () => {
    const input: FindAllUsersInput = { limit: 10 };
    const output = await useCaseFindAllUsers.execute(input);

    expect(output.users).toHaveLength(testUsersData.length);
    expect(output.lastEvaluatedKey).toBeUndefined();
  });

  it("should return an empty array when limit is 0", async () => {
    const input: FindAllUsersInput = { limit: 0 };
    const output = await useCaseFindAllUsers.execute(input);

    expect(output.users).toHaveLength(0);
    expect(output.lastEvaluatedKey).toBeUndefined();
  });

  it("should return an empty array when limit is negative", async () => {
    const input: FindAllUsersInput = { limit: -1 };
    const output = await useCaseFindAllUsers.execute(input);

    expect(output.users).toHaveLength(0);
    expect(output.lastEvaluatedKey).toBeUndefined();
  });
});
