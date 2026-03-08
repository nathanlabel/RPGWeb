import { describe, it, beforeEach } from "node:test";
import assert from "node:assert";
import { Character, CreateCharacter, DeleteCharacterByID, GetCharacterByID, GetCharacters, UpdateCharacterByID } from "./characters";
import { ResultStatus } from "../../types/result";

describe("CreateCharacter", async () => {
    it("should create a character with valid fields", async () => {
        const result = await CreateCharacter({ name: "Rogmar", class: "Barbarian", level: 2 });
        const char = result.data as Character
        assert.strictEqual(result.success, ResultStatus.OK);
        assert.strictEqual(char.name, "Rogmar");
        assert.strictEqual(char.level, 2);
        assert.strictEqual(char.class, "Barbarian");
    });
    it("should fail when name is missing a value", async () => {
        const result = await CreateCharacter({ name: "", class: "Barbarian", level: 2 });
        assert.strictEqual(result.success, ResultStatus.Failed);
    });
    it("should fail when class is missing a value", async () => {
        const result = await CreateCharacter({ name: "Nathan", class: "", level: 2 });
        assert.strictEqual(result.success, ResultStatus.Failed);
    });
    it("should return level: 1 is level is missing a value", async () => {
        const result = CreateCharacter({ name: "Nathan", class: "Fighter" });
        const char = result.data as Character;

        assert.strictEqual(char.level, 1);
    });
    it("should auto-increment id by for each new char", async () => {
        for (let i = 1; i <= 10; i++) {
            const result = await CreateCharacter({ name: "Rogmar", class: "Barbarian", level: 2 });
            const char = result.data as Character;
            assert.strictEqual(char.id, i);
        }
    });

});

describe("GetCharacters", () => {
    it("should get a list containing two characters", () => {
        CreateCharacter({ name: "Rogmar", class: "Barbarian", level: 2 });
        CreateCharacter({ name: "Rogmar", class: "Barbarian", level: 2 });
        const result = GetCharacters();
        const chars = result.data as Character[];

        assert.strictEqual(chars.length, 2);
    });
    it("should be an empty list when containing no characters", () => {
        const result = GetCharacters();
        const chars = result.data as Character[];

        assert.strictEqual(chars.length, 0);
    });
});

describe("UpdateCharacterByID", () => {
    it("should update a character", async () => {
        CreateCharacter({ name: "Rogmar", class: "Barbarian", level: 2 });
        const result = await UpdateCharacterByID(1, { name: "Nathan" });
        const char = await result.data as Character;

        assert.strictEqual(result.success, ResultStatus.OK);
        assert.strictEqual(char.name, "Nathan");
    });
    it("should fail when field doesnt exist", async () => {
        CreateCharacter({ name: "Rogmar", class: "Barbarian", level: 2 });
        const result = await UpdateCharacterByID(1, { wrongName: "Nathan" });
        const char = result.data as Character;

        assert.strictEqual(result.success, ResultStatus.Failed);
    });
    it("should fail when index doesnt exist", async () => {
        CreateCharacter({ name: "Rogmar", class: "Barbarian", level: 2 });
        const result = await UpdateCharacterByID(2, { name: "Nathan" });

        assert.strictEqual(result.success, ResultStatus.Failed);
    });
    it("should skip id field", () => {
        CreateCharacter({ name: "Rogmar", class: "Barbarian", level: 2 });
        UpdateCharacterByID(1, { id: 10, name: "Nathan" });
        const result = GetCharacterByID(1);
        const char = result.data as Character;

        assert.strictEqual(char.id, 1);
        assert.strictEqual(char.name, "Nathan");
    });
});

describe("DeleteCharacterByID", () => {
    it("should delete a character", () => {
        CreateCharacter({ name: "Rogmar", class: "Barbarian", level: 2 });
        const deletedResult = DeleteCharacterByID(1);
        const chars = (GetCharacters().data) as Character[]

        assert.strictEqual(deletedResult.success, ResultStatus.OK);
        assert.strictEqual(chars.length, 0);
    })
})