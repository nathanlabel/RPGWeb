import { createServer } from 'http';
import { routeHandler } from './handler';

const port = 3000;
const server = createServer(routeHandler);

server.listen(port, () => {
    console.log("Hello World");
})