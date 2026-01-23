import { Request, Response } from "express";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";
import { createUser, generateTokens, verifyLogin } from "../services/auth.service.js";
import { redisClient } from "../config/redis.js";
import jsonwebtoken from 'jsonwebtoken';
import AppError from "../utils/errorModel.js";
import { config } from "../config/env.js";

// POST -> /register
export const register = async (req: Request, res: Response) => {
    const data = registerSchema.parse(req.body);

    await createUser(data);

    return successResponse({
        res,
        message: "Register successful",
        statusCode: 201
    });
}

// POST -> /login   
export const login = async (req: Request, res: Response) => {
    const data = loginSchema.parse(req.body);

    const user = await verifyLogin(data.username, data.password);
    
    if (!user) {
        throw new AppError("Invalid username or password", 401);
    }

    const tokens = generateTokens(user.id);

    res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    await redisClient.set(user.id.toString(), tokens.refreshToken);

    return successResponse({
        res,
        message: "Login successful",
        data: {
            accessToken: tokens.accessToken,
            refreshToken: "",
        }
    });
}

// POST -> /logout
export const logout = async (req: Request, res: Response) => {
    const user = (req as any).user;

    await redisClient.del(user.id.toString());

    return successResponse({
        res,
        message: "Logout successful"
    })
}

// POST -> /token/refresh
export const refreshToken = async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken;

    if (!token) {
        throw new AppError("Refresh token not provided", 401);
    }

    let decoded: any;

    try {
        decoded = jsonwebtoken.verify(token, config.jwtRefreshSecret as string);
    } catch (err: any) {
        throw new AppError("Invalid refresh token", 401);
    }

    if (!await redisClient.get(decoded.userId)) {
        throw new AppError("Invalid refresh token", 401);
    }

    const tokens = generateTokens(decoded.userId);

    return successResponse({
        res,
        message: "Refresh token successful",
        data: {
            accessToken: tokens.accessToken,
        }
    });
}