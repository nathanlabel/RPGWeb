import { Result, ResultStatus } from "../../types/result";
import db from "./database";

export interface Character {
    id: number;
    name: string;
    class: string;
    level?: number;
}

// SQL Statements

const insertStmt = db.prepare(
    "INSERT INTO characters (name, class, level) VALUES (@name, @class, @level)");
const selectByIdStmt = db.prepare(
    "SELECT * FROM characters WHERE id = ?");
const selectAllStmt = db.prepare(
    "SELECT * FROM CHARACTERS");
const deleteByIdStmt = db.prepare(
    "DELETE FROM characters WHERE id = ?");
const updateStmt = db.prepare(
    "UPDATE characters SET name = @name, class = @class, level = @level WHERE id = @id"
);

export const CreateCharacter = (c: Omit<Character, "id">): Result => {
    if (!c.name || !c.class) {
        return {
            success: ResultStatus.Failed,
            error: "does not contain required fields"
        }
    }
    const result = insertStmt.run({
        name: c.name,
        class: c.class,
        level: c.level ?? 1
    })
    const character = selectByIdStmt.get(result.lastInsertRowid) as Character;
    return {
        success: ResultStatus.OK,
        data: character,
    }
};

export const GetCharacters = (): Result => {
    const characters = selectAllStmt.all() as Character[];
    return { success: ResultStatus.OK, data: characters}
};

export const GetCharacterByID = (id: number): Result => {
    const char = selectByIdStmt.get(id) as Character | undefined;
    if (!char) return { success: ResultStatus.Failed, error: `Cannot find character by ID: ${id}`}

    return {
        success: ResultStatus.OK,
        data: char,
    }
}

export const DeleteCharacterByID = (id: number): Result => {
    const char = selectByIdStmt.get(id) as Character | undefined;
    const result = deleteByIdStmt.run(id);
    if (result.changes === 0) {
        return { success: ResultStatus.Failed, error: `cannot find by ID: ${id}`}
    }
    return { success: ResultStatus.OK, data: char }
}

export const UpdateCharacterByID = (id: number, values: Record<string, unknown>): Result => {
    const existing = selectByIdStmt.get(id) as Character | undefined;
    if (!existing) {
        return { success: ResultStatus.Failed, error: `Cannot find character by ID: ${id}` };
    }

    const validKeys = ["name", "class", "level"];
    const invalid = Object.keys(values).filter(k => k !== "id" && !validKeys.includes(k));
    if (invalid.length > 0) {
        return { success: ResultStatus.Failed, error: `Invalid properties: ${invalid.join(", ")}` };
    }

    const updated = { ...existing, ...values, id }; // preserve id
    updateStmt.run(updated);
    return { success: ResultStatus.OK, data: updated };
};