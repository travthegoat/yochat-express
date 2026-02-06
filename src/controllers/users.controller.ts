import { Request, Response } from "express";
import { successResponse } from "../utils/apiResponse.js";
import { userResponseSchema, userUpdateSchema } from "../schemas/users.schema.js";
import db from "../config/db.js";
import { profilesTable, usersTable } from "../db/schema.js";
import { eq, like } from "drizzle-orm";
import { retrieveUser } from "../services/users.service.js";
import AppError from "../utils/errorModel.js";
import z from "zod";

// GET -> /users/me
export const getAuthenticatedUser = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const user = await retrieveUser(userId);

    return successResponse({
        res,
        message: "Success",
        data: userResponseSchema.parse(user),
    });
}

// PUT -> /users/me
export const updateAuthenticatedUser = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const data = userUpdateSchema.parse(req.body);

    await db.update(profilesTable).set(data).where(eq(profilesTable.userId, userId));

    return successResponse({
        res,
        message: "User updated successfully"
    });
}

// GET -> /users/{id}
export const getUserById = async (req: Request, res: Response) => {
    const id = req.params.id;

    const user = await retrieveUser(id as string);

    if (!user) {
        throw new AppError('User not found', 404);
    }

    return successResponse({
        res,
        message: "Success",
        data: userResponseSchema.parse(user),
    });
}

// GET -> /users/?search={value}
export const searchUsers = async (req: Request, res: Response) => {
    const { search } = req.query;

    const users = await db.query.usersTable.findMany({
        where: like(usersTable.username, `%${search}%`),
        with: {
            profile: true,
        }
    })

    return successResponse({
        res,
        message: "Success",
        data: z.array(userResponseSchema).parse(users)
    });
}