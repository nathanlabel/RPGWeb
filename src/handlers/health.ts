import { IncomingMessage, ServerResponse } from "node:http";
import { RouteContext } from "../routes";

export const GetHealth = async (req:IncomingMessage, res: ServerResponse, ctx: RouteContext) => {
    res.writeHead(200, { "content-type": "application/json" });
    res.write(JSON.stringify({ "Status": "OK" }));
    res.end();
}