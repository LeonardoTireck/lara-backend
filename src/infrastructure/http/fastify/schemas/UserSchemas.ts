import z from 'zod';

const planSchema = z.object({
    planType: z.enum(['silver', 'gold', 'diamond']),
    paymentMethod: z.enum(['PIX', 'card']),
});

export const createUserSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters long'),
    email: z.email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    documentCPF: z.string().min(11, 'A valid document is required'),
    phone: z.string().min(10, 'A valid phone number is required'),
    dateOfBirth: z.coerce.date(),
    activePlan: planSchema,
});
