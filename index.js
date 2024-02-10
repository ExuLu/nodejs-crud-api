import { createServer } from 'http';
import users from './utils/users.js';

const port = 3000;
const server = createServer((req, res) => {
  const { url, method } = req;
  if (url === '/users' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
  }
});

server.listen(port, () => console.log(`Server listened in port ${port}`));
