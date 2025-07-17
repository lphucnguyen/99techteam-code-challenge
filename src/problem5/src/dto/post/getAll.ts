import z from 'zod';

export const GetAllPostsInputSchema = z.object({
    page: z.coerce.number().int().optional(),
    searchKey: z.string().optional(),
    sortBy: z.enum(['title', 'createdAt'], 'sortBy is not valid').optional(),
    sortOrder: z.enum(['asc', 'desc'], 'sortOrder is not valid').optional()
});

export type GetAllPostsInputDTO = z.infer<typeof GetAllPostsInputSchema>;