// src/routes/characters.ts
import { Hono } from "hono";
import {
    CreateCharacter,
    DeleteCharacterByID,
    GetCharacterByID,
    GetCharacters,
    UpdateCharacterByID,
} from "../data/characters/characters";
import { ResultStatus } from "../types/result";

export const characterRoutes = new Hono();

// GET /characters
characterRoutes.get("/characters", (c) => {
    const result = GetCharacters();
    if (result.success === ResultStatus.OK) {
        return c.json(result.data);
    }
    return c.json({ error: "Failed to get characters" }, 500);
});

// GET /character/:id
characterRoutes.get("/character/:id", (c) => {
    const id = Number(c.req.param("id"));
    const result = GetCharacterByID(id);
    if (result.success === ResultStatus.OK) {
        return c.json(result.data);
    }
    return c.json({ error: result.error }, 404);
});

// POST /character
characterRoutes.post("/character", async (c) => {
    const body = await c.req.json();   // ← replaces parseBody + JSON.parse
    const result = CreateCharacter(body);
    if (result.success === ResultStatus.Failed) {
        return c.json({ error: result.error }, 400);
    }
    return c.json(result.data, 201);
});

// PUT /character/:id
characterRoutes.put("/character/:id", async (c) => {
    const id = Number(c.req.param("id"));
    const body = await c.req.json();
    const result = UpdateCharacterByID(id, body);
    if (result.success === ResultStatus.Failed) {
        return c.json({ error: result.error }, 400);
    }
    return c.json(result.data);
});

// DELETE /character/:id
characterRoutes.delete("/character/:id", (c) => {
    const id = Number(c.req.param("id"));
    const result = DeleteCharacterByID(id);
    if (result.success === ResultStatus.Failed) {
        return c.json({ error: result.error }, 404);
    }
    return c.json(result.data);
});