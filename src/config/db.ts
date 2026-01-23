import { drizzle } from "drizzle-orm/neon-http";
import { config } from "./env.js";

const db = drizzle(config.databaseUrl);

export default db;