import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { characterRoutes } from './routes/characters';
import { HTTPException } from 'hono/http-exception';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';

const app = new Hono();

app.use("*", logger());
app.use("*", cors());

app.onError((err, c) => {
    if (err instanceof HTTPException) {
        return c.json({ error: err.message }, err.status);
    }
    console.error("unhandled error:", err);
    return c.json({ error: "Internal Server Error" }, 500);
})

// Health Check
app.get("/health", (c) => {
    return c.json({ status: "OK" });
});

// Root
app.get("/", (c) => {
    return c.text("Welcome to RPG Web");
});

app.route("/", characterRoutes);

serve({
    fetch: app.fetch,
    port: 3000
}, () => {
    console.log("server running on port 3000");
});