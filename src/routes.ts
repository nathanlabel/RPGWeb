import { IncomingMessage, ServerResponse } from "node:http";
import { URLSearchParams } from "node:url";

export interface RouteContext {
    path: string;
    query: URLSearchParams;
    params: Record<string, string>;
};

export type Handler = (req: IncomingMessage, res: ServerResponse, ctx: RouteContext) => Promise<void> | void;
export type Route = Record<string, Handler>;


