import app from "./app.js";
import { config } from "./config/env.js";
import { connectRedis } from "./config/redis.js";

await connectRedis();

app.listen(config.port, () => {
    console.log("[SUCCESS] Server is running on port " + config.port);
});