import { CreateUser } from '../../../src/application/usecases/CreateUser.usecase';
import { FindUserById } from '../../../src/application/usecases/FindUserById.usecase';
import { UpdateTrainingSessions } from '../../../src/application/usecases/UpdateTrainingSessions.usecase';
import { TrainingPlan } from '../../../src/domain/TrainingPlan';
import { TrainingSession } from '../../../src/domain/TrainingSession';
import BcryptPasswordHasher from '../../../src/infrastructure/Hashing/BcryptPasswordHasher';
import { InMemoryUserRepo } from '../../../src/infrastructure/inMemory/InMemoryUserRepo';

describe('UpdateTrainingSessions Use Case', () => {
    let repo: InMemoryUserRepo;
    let user: { id: string };
    let useCaseFindById: FindUserById;
    let useCaseUpdateTrainingSessions: UpdateTrainingSessions;

    beforeEach(async () => {
        repo = new InMemoryUserRepo();
        const bcryptPasswordHasher = new BcryptPasswordHasher(1);
        const useCaseCreate = new CreateUser(repo, bcryptPasswordHasher);
        useCaseFindById = new FindUserById(repo);
        useCaseUpdateTrainingSessions = new UpdateTrainingSessions(repo);

        const input = {
            name: 'Leonardo Tireck',
            email: 'leo@test.com',
            documentCPF: '11144477735',
            phone: '47992000622',
            dateOfBirth: new Date(),
            password: 'Test123@',
            activePlan: TrainingPlan.create('silver', 'PIX'),
        };
        user = await useCaseCreate.execute(input);
    });

    it('should add a training session to a client', async () => {
        const newTrainingSession = TrainingSession.create(
            'A',
            [
                {
                    name: 'Supino Reto',
                    sets: [
                        { orderNumber: 1, reps: 10, weight: 10 },
                        { orderNumber: 2, reps: 10, weight: 10 },
                        { orderNumber: 3, reps: 10, weight: 10 },
                    ],
                    notes: 'notes about the specific exercise',
                    restInSeconds: 60,
                    videoUrl: 'videoUrl',
                },
            ],
            ['Array of notes about the training session itself'],
            60,
        );

        const updatedUser = await useCaseUpdateTrainingSessions.execute(
            user.id,
            [newTrainingSession],
        );

        expect(updatedUser.trainingSessions).toHaveLength(1);
        expect(updatedUser.trainingSessions[0].sessionDay).toBe('A');
        expect(updatedUser.trainingSessions[0].exercises[0].name).toBe(
            'Supino Reto',
        );
        expect(
            updatedUser.trainingSessions[0].exercises[0].sets[0].orderNumber,
        ).toBe(1);
        expect(updatedUser.trainingSessions[0].exercises[0].notes).toBe(
            'notes about the specific exercise',
        );
        expect(updatedUser.trainingSessions[0].durationMinutes).toBe(60);
    });

    it('should update an existing training session', async () => {
        const initialSession = TrainingSession.create('A', [
            {
                name: 'Initial Exercise',
                sets: [{ orderNumber: 1, reps: 5, weight: 5 }],
                notes: '',
                restInSeconds: 30,
                videoUrl: '',
            },
        ]);
        await useCaseUpdateTrainingSessions.execute(user.id, [initialSession]);

        const updatedSession = TrainingSession.create(
            'A',
            [
                {
                    name: 'Updated Exercise',
                    sets: [{ orderNumber: 1, reps: 10, weight: 10 }],
                    notes: 'Updated notes',
                    restInSeconds: 60,
                    videoUrl: 'newVideoUrl',
                },
            ],
            ['Updated session notes'],
            90,
        );

        const updatedUser = await useCaseUpdateTrainingSessions.execute(
            user.id,
            [updatedSession],
        );

        expect(updatedUser.trainingSessions).toHaveLength(1);
        expect(updatedUser.trainingSessions[0].exercises[0].name).toBe(
            'Updated Exercise',
        );
        expect(updatedUser.trainingSessions[0].notes).toEqual([
            'Updated session notes',
        ]);
        expect(updatedUser.trainingSessions[0].durationMinutes).toBe(90);
    });

    it('should replace all existing training sessions', async () => {
        const initialSession1 = TrainingSession.create('A', [
            {
                name: 'Ex1',
                sets: [{ orderNumber: 1, reps: 1, weight: 1 }],
                notes: '',
                restInSeconds: 1,
                videoUrl: '',
            },
        ]);
        const initialSession2 = TrainingSession.create('B', [
            {
                name: 'Ex2',
                sets: [{ orderNumber: 1, reps: 1, weight: 1 }],
                notes: '',
                restInSeconds: 1,
                videoUrl: '',
            },
        ]);
        await useCaseUpdateTrainingSessions.execute(user.id, [
            initialSession1,
            initialSession2,
        ]);

        const newSession = TrainingSession.create('C', [
            {
                name: 'New Ex',
                sets: [{ orderNumber: 1, reps: 10, weight: 10 }],
                notes: '',
                restInSeconds: 60,
                videoUrl: '',
            },
        ]);

        const updatedUser = await useCaseUpdateTrainingSessions.execute(
            user.id,
            [newSession],
        );

        expect(updatedUser.trainingSessions).toHaveLength(1);
        expect(updatedUser.trainingSessions[0].sessionDay).toBe('C');
    });

    it('should clear all training sessions if an empty array is provided', async () => {
        const initialSession = TrainingSession.create('A', [
            {
                name: 'Ex1',
                sets: [{ orderNumber: 1, reps: 1, weight: 1 }],
                notes: '',
                restInSeconds: 1,
                videoUrl: '',
            },
        ]);
        await useCaseUpdateTrainingSessions.execute(user.id, [initialSession]);

        const updatedUser = await useCaseUpdateTrainingSessions.execute(
            user.id,
            [],
        );

        expect(updatedUser.trainingSessions).toHaveLength(0);
    });

    it('should throw an error if the user is not found', async () => {
        const nonExistentUserId = 'non-existent-user-id';
        const trainingSession = TrainingSession.create('A', [
            {
                name: 'Ex',
                sets: [{ orderNumber: 1, reps: 1, weight: 1 }],
                notes: '',
                restInSeconds: 1,
                videoUrl: '',
            },
        ]);

        await expect(
            useCaseUpdateTrainingSessions.execute(nonExistentUserId, [
                trainingSession,
            ]),
        ).rejects.toThrow('User not found.');
    });
});
