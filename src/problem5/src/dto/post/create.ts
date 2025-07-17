import z from 'zod';

export const CreatePostInputSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    content: z.string().min(1, 'Content is required'),
});

export type CreatePostInputDTO = z.infer<typeof CreatePostInputSchema>;