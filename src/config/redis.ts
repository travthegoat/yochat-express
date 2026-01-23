import { Redis } from '@upstash/redis';
import { config } from './env.js';

const client = new Redis({
    url: config.redisUrl,
    token: config.redisToken
});

export const connectRedis = async () => {
    try {
        await client.ping();
        console.log("[SUCCESS] Redis is connected");
    } catch (err) {
        console.log("[ERROR] Redis is not connected");
    }
}

export const redisClient = client