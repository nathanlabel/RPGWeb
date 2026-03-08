import { ServerResponse } from "node:http";

export const sendError = (res:ServerResponse, status:number, message:string): void => {
    res.writeHead(status, { "content-type": "application/json" });
    res.end(JSON.stringify({
        "error": message
    }))
}

export const sendOK = (res:ServerResponse): void => {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({
        status: "ok"
    }))
}

export const sendJSON = (res:ServerResponse, jsonObject:Object, code?:number) => {
    const resCode = code || 200;
    res.writeHead(resCode, { "content-type": "application/json" });
    res.end(JSON.stringify(jsonObject));
}