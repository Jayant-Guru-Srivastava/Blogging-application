import z from 'zod';
export declare const signupInput: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
    full_name: z.ZodOptional<z.ZodString>;
    bio: z.ZodOptional<z.ZodString>;
    avatar_url: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    username: string;
    password: string;
    full_name?: string | undefined;
    bio?: string | undefined;
    avatar_url?: string | undefined;
}, {
    username: string;
    password: string;
    full_name?: string | undefined;
    bio?: string | undefined;
    avatar_url?: string | undefined;
}>;
export type SignupInput = z.infer<typeof signupInput>;
export declare const signinInput: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    username: string;
    password: string;
}, {
    username: string;
    password: string;
}>;
export type SigninInput = z.infer<typeof signinInput>;
export declare const updateUserInput: z.ZodObject<{
    username: z.ZodString;
    full_name: z.ZodOptional<z.ZodString>;
    bio: z.ZodOptional<z.ZodString>;
    avatar_url: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    username: string;
    full_name?: string | undefined;
    bio?: string | undefined;
    avatar_url?: string | undefined;
}, {
    username: string;
    full_name?: string | undefined;
    bio?: string | undefined;
    avatar_url?: string | undefined;
}>;
export type UpdateUserInput = z.infer<typeof updateUserInput>;
export declare const updatePasswordInput: z.ZodObject<{
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    password: string;
}, {
    password: string;
}>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordInput>;
export declare const createBlogInput: z.ZodObject<{
    title: z.ZodString;
    content: z.ZodString;
    tagName: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    categoryName: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    title: string;
    content: string;
    tagName?: string[] | undefined;
    categoryName?: string[] | undefined;
}, {
    title: string;
    content: string;
    tagName?: string[] | undefined;
    categoryName?: string[] | undefined;
}>;
export type CreateBlogInput = z.infer<typeof createBlogInput>;
export declare const updateBlogInput: z.ZodObject<{
    title: z.ZodString;
    content: z.ZodString;
    tagName: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    categoryName: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    title: string;
    content: string;
    tagName?: string[] | undefined;
    categoryName?: string[] | undefined;
}, {
    title: string;
    content: string;
    tagName?: string[] | undefined;
    categoryName?: string[] | undefined;
}>;
export type UpdateBlogInput = z.infer<typeof updateBlogInput>;
export declare const commentOnBlogBody: z.ZodObject<{
    comment: z.ZodString;
}, "strip", z.ZodTypeAny, {
    comment: string;
}, {
    comment: string;
}>;
export type CommentOnBlogBody = z.infer<typeof commentOnBlogBody>;
