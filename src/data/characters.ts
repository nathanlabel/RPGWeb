import { Result, ResultStatus } from "../types/result";

export interface Character {
    id: number;
    name: string;
    class: string;
    level?: number;
}

let nextID = 1;
const characters: Character[] = [];

export const CreateCharacter = (c: Omit<Character, "id">): Result => {
    const character = { ...c, id:nextID++ };
    if (!character.name || !character.class) {
        return {
            success: ResultStatus.Failed,
            error: "does not contain required fields"
        }
    }
    if (!c.level) character.level = 1;
    characters.push(character);
    return {
        success: ResultStatus.OK,
        data: character,
    }
};

export const GetCharacters = (): Result => {return { success: ResultStatus.OK, data: characters}};

export const GetCharacterByID = (id: number): Result => {
    const char = characters.find(c => c.id === id);
    if (!char) return { success: ResultStatus.Failed, error: `Cannot find character by ID: ${id}`}

    return {
        success: ResultStatus.OK,
        data: char,
    }
}

export const DeleteCharacterByID = (id: number): Result => {
    const index = characters.findIndex(c => c.id === id);
    if (index === -1) return { success: ResultStatus.Failed, error: `cannot find character by id: ${id}`};
    const removed = characters.splice(index, 1);
    return {
        success: ResultStatus.OK,
        data: removed,
    }
}

export const UpdateCharacterByID = (id: number, values:Object): Result => {
    const result = GetCharacterByID(id);
    if (result.success === ResultStatus.Failed) {
        return { success: ResultStatus.Failed, error: result.error };
    }

    const char = result.data as Character;  // now we know it exists

    const notFound: string[] = [];
    for (const [key, field] of Object.entries(values)) {
        if (key === "id") continue;
        if (!(key in char)) {
            notFound.push(key);
        }
    }

    if (notFound.length > 0) {
        return { 
            success: ResultStatus.Failed, 
            error: `Invalid properties: ${notFound.join(", ")}`
        };
    }

    for (const [key, field] of Object.entries(values)) {
        if (key === "id") continue;
        (char as any)[key] = field;
    }

    return { success: ResultStatus.OK, data: char };
}

export const ResetCharacters = () => {
    characters.length = 0;
    nextID = 1;
};