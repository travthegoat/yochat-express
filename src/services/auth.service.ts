import bcrypt from 'bcrypt';
import db from '../config/db.js';
import { errorResponse } from '../utils/apiResponse.js';
import jsonwebtoken from 'jsonwebtoken';
import { config } from '../config/env.js';
import { profilesTable, usersTable } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import AppError from '../utils/errorModel.js';

export const createUser = async (userData: { username: string; email: string; password: string }) => {
    const { username, email, password } = userData;

    const existing = await db.select().from(usersTable).where(eq(usersTable.username, username)).then(res => res[0])
    if (existing) {
        throw new AppError("Username already exists", 409);
    }

    const passwordHashed = await bcrypt.hash(password, 10);

    const [user] = await db.insert(usersTable).values({
        username,
        email,
        password: passwordHashed,
    }).returning({ id: usersTable.id });

    // create profile for user
    const profile: typeof profilesTable.$inferInsert = {
        userId: user.id as string,
    }

    await db.insert(profilesTable).values(profile);
}

export const verifyLogin = async (username: string, password: string) => {
    const user = await db.select().from(usersTable).where(eq(usersTable.username, username)).then(res => res[0]);

    if (!user) {
        return false;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    return isPasswordValid ? user : false;
}

export const generateTokens = (userId: string) => {
    const accessToken = jsonwebtoken.sign(
        { userId },
        config.jwtAccessSecret as string,
        { expiresIn: '15m' }
    );
    const refreshToken = jsonwebtoken.sign(
        { userId },
        config.jwtRefreshSecret as string,
        { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
}