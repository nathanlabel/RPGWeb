import { IncomingMessage } from "node:http";

export const parseBody = (req: IncomingMessage): Promise<string> => {
    return new Promise((resolve, reject) => {
        let body:string = "";
        req.on("data", (chunk) => { body += chunk });
        req.on("end", () => resolve(body));
        req.on("error", reject);
    })
}