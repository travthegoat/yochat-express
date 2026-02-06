import { eq } from "drizzle-orm"
import db from "../config/db.js"
import { usersTable } from "../db/schema.js"
import { redisClient } from "../config/redis.js"
import { userUpdateSchema } from "../schemas/users.schema.js"

export const retrieveUser = async (id: string) => {
    const cachedUser = await redisClient.get(`users:${id}`);
    if (cachedUser) return cachedUser;

    const user = db.query.usersTable.findFirst({
        where: eq(usersTable.id, id),
        with: {
            profile: true,
        }
    });

    await redisClient.set(`users:${id}`, user);

    return user;
}

