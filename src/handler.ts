import { IncomingMessage, ServerResponse } from "node:http";
import { Route, Handler, RouteContext } from "./routes";
import { IndexHandler } from "./handlers";
import { GetHealth } from "./handlers/health";
import { CreateCharacterHandler, GetCharactersHandler, GetCharacterHandler, UpdateCharacterHandler, DeleteCharacterHandler } from "./handlers/character"
import { sendError } from "./http/response";


const routes: Route = {
    "GET /": IndexHandler,
    "GET /health": GetHealth,

    "POST /character": CreateCharacterHandler,
    "GET /character/:id": GetCharacterHandler,
    "PUT /character/:id": UpdateCharacterHandler,
    "DELETE /character/:id": DeleteCharacterHandler,

    "GET /characters": GetCharactersHandler,
}

const matchRoute = (method: string, path: string) => {
    for (const [key, handler] of Object.entries(routes)) {
        const [routeMethod, routePattern] = key.split(" ");

        if (routeMethod !== method) continue;

        const routeParts = routePattern.split("/");
        const pathParts = path.split("/");

        if (routeParts.length !== pathParts.length) continue;

        const params: Record<string, string> = {};

        const match = routeParts.every((part, i) =>{
            if (part.startsWith(":")) {
                params[part.slice(1)] = pathParts[i];
                return true;
            }
            return part === pathParts[i];
        });

        if (match) return { handler, params };
    }

    return undefined;
}

export const routeHandler = async (req: IncomingMessage, res: ServerResponse) => {
    const parsedURL = new URL(req.url ?? "", `http://${req.headers.host}`);
    const path = parsedURL.pathname;
    const method = req.method ?? "GET";

    console.log(`Received Request: ${method} ${path}`);

    const result = matchRoute(method, path);
    if (result) {
        try {
            await result.handler(req, res, {
                path,
                query: parsedURL.searchParams,
                params: result.params,
            });
            return;
        }
        catch (err) {
            console.log(`Unhandled Error: ${err}`);
            return;
        }
    }
    sendError(res, 404, "not found");
};