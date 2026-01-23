import dotenv from 'dotenv';
dotenv.config();

type Config = {
    port: number | string;
    databaseUrl: string;
    redisUrl: string;
    redisToken: string;
    jwtAccessSecret: string | undefined;
    jwtRefreshSecret: string | undefined;
}

export const config: Config = {
    port: process.env.PORT || 8000,
    databaseUrl: process.env.DATABASE_URL || '',
    redisUrl: process.env.REDIS_URL || '',
    redisToken: process.env.REDIS_TOKEN || '',
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
}