import z from "zod";

export const registerSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters").max(30, "Username must be at most 30 characters"),
    email: z.email("Invalid email address").nonempty("Email is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
    username: z.string().nonempty("Username is required"),
    password: z.string().nonempty("Password is required"),
});