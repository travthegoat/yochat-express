import app from "./app.js";
import { config } from "./configs/env.js";

app.listen(config.port, () => {
    console.log("[SUCCESS] Server is running on port " + config.port);
});