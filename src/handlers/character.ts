import { IncomingMessage, ServerResponse } from "node:http";
import { parseBody } from "../body";
import { RouteContext } from "../routes";
import { sendError, sendJSON, sendOK } from "../http/response";
import { CreateCharacter, DeleteCharacterByID, GetCharacterByID, GetCharacters, UpdateCharacterByID } from "../data/characters";
import { ResultStatus } from "../types/result";

export const GetCharacterHandler = async (req:IncomingMessage, res:ServerResponse, ctx: RouteContext) => {
    const id = Number(ctx.params["id"]);
    const result = GetCharacterByID(id);

    if (result.success === ResultStatus.OK) {
        sendJSON(res, result.data);
        return;
    }

    sendError(res, 404, result.error);
}

export const GetCharactersHandler = async (req:IncomingMessage, res: ServerResponse, ctx: RouteContext) => {
    const result = GetCharacters();
    if (result.success === ResultStatus.OK)
        sendJSON(res, result.data);
    else
        sendError(res, 500, result.error || "failed to get characters");

}

export const CreateCharacterHandler = async (req: IncomingMessage, res: ServerResponse, ctx: RouteContext) => {
    try {
        const body: string = await parseBody(req);
        const charValues = JSON.parse(body);
        const result = CreateCharacter(charValues);
        if (result.success === ResultStatus.Failed) {
            sendError(res, 400, result.error);
            return;
        }
        sendJSON(res, result.data, 201);
    } catch (err) {
        sendError(res, 400, (err as Error).message || "Invalid JSON");
    }
}

export const UpdateCharacterHandler = async (req: IncomingMessage, res: ServerResponse, ctx: RouteContext) => {
    const id = Number(ctx.params["id"]);
    try {
        const changes = JSON.parse(await parseBody(req));
        const result = UpdateCharacterByID(id, changes);
        if (result.success === ResultStatus.Failed) return sendError(res, 404, result.error);
        return sendJSON(res, result.data);
    }
    catch (err) {
        sendError(res, 400, (err as Error).message);
        return;
    }
};

export const DeleteCharacterHandler = async (req:IncomingMessage, res: ServerResponse, ctx: RouteContext) => {
    const id = Number(ctx.params["id"]);
    const result = DeleteCharacterByID(id);
    
    if (result.success === ResultStatus.Failed) {
        sendError(res, 404, result.error)
        return;
    }

    sendJSON(res, result.data);
}