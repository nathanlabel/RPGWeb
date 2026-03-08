import { IncomingMessage, ServerResponse } from "node:http";
import { RouteContext } from "../routes";

export const IndexHandler = async (req:IncomingMessage, res: ServerResponse, ctx: RouteContext) => {
    res.writeHead(200, { "content-type": "text/plain" });
    res.write("Welcome to RPG Web");
    res.end();
}