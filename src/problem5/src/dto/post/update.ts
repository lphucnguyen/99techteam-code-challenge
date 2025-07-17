import z from 'zod';

export const UpdatePostInputSchema = z.object({
    title: z.string().min(1, 'Title is not valid').optional(),
    content: z.string().min(1, 'Content is not valid').optional(),
});

export type UpdatePostInputDTO = z.infer<typeof UpdatePostInputSchema>;