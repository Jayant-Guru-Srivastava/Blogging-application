import z from 'zod'

export const signupInput = z.object({
    username: z.string().email(),
    password: z.string().min(6),
    full_name: z.string().optional(),
    bio: z.string().optional(),
    avatar_url: z.string().optional()
});

export type SignupInput = z.infer<typeof signupInput>;

export const signinInput = z.object({
    username: z.string().email(),
    password: z.string().min(6)
});

export type SigninInput = z.infer<typeof signinInput>;

export const updateUserInput = z.object({
    username: z.string().email(),
    full_name: z.string().optional(),
    bio: z.string().optional(),
    avatar_url: z.string().optional()
});

export type UpdateUserInput = z.infer<typeof updateUserInput>;

export const updatePasswordInput = z.object({
    password: z.string().min(6)
});

export type UpdatePasswordInput = z.infer<typeof updatePasswordInput>;

export const createBlogInput = z.object({
    title: z.string(),
    content: z.string(),
    tagName: z.array(z.string()).optional(),
    categoryName: z.array(z.string()).optional()
});

export type CreateBlogInput = z.infer<typeof createBlogInput>;

export const updateBlogInput = z.object({
    title: z.string(),
    content: z.string(),
    tagName: z.array(z.string()).optional(),
    categoryName: z.array(z.string()).optional()
});

export type UpdateBlogInput = z.infer<typeof updateBlogInput>;

export const commentOnBlogBody = z.object({
    comment: z.string()
});

export type CommentOnBlogBody = z.infer<typeof commentOnBlogBody>;