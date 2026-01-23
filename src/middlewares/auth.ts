import { NextFunction, Request, Response } from "express";
import AppError from "../utils/errorModel.js";
import jsonwebtoken from 'jsonwebtoken';
import { config } from "../config/env.js";
import db from "../config/db.js";
import { usersTable } from "../db/schema.js";
import { eq } from "drizzle-orm";

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        throw new AppError("Unauthorized", 401);
    }

    let decoded: any;
    try {
        decoded = jsonwebtoken.verify(token, config.jwtAccessSecret as string);
    } catch (err: any) {
        throw new AppError("Invalid token", 401);
    }

    const user = await db.select().from(usersTable).where(eq(usersTable.id, decoded.userId)).then(res => res[0]);
    if (!user) {
        throw new AppError("User not found", 401);
    }

    (req as any).user = user;
    next();
}