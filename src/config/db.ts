import { drizzle } from "drizzle-orm/neon-http";
import { config } from "./env.js";
import { profilesTable, usersRelations, usersTable } from "../db/schema.js";

const db = drizzle(config.databaseUrl, {
    schema: {
        usersTable,
        profilesTable,
        usersRelations,
    }
});

export default db;