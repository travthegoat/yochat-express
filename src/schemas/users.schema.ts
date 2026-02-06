import z from "zod";

const profileSchema = z.object({
    id: z.string(),
    name: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

const userSchema = z.object({
    id: z.string(),
    username: z.string(),
    email: z.email(),
    profile: profileSchema,
    isActive: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string()
});

export const userResponseSchema = userSchema;

export const userUpdateSchema = profileSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
}).partial();