import { createServer } from 'http';
import users from './utils/users.js';
import { validate, v4 as uuidv4 } from 'uuid';

const port = 3000;
const server = createServer((req, res) => {
  const { url, method } = req;
  if (url === '/users' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
  }
  if (url.includes('/users/') && method === 'GET') {
    const id = url.slice(url.lastIndexOf('/') + 1);
    const isUUID = validate(id);
    if (!isUUID) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('The id has wrong format');
      return;
    }
    const user = users.find((use) => use.id === id);

    if (user) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(user));
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('We do not have user with such id');
    }
  }
  if (url.includes('/users') && method === 'POST') {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => {
      const parsedData = JSON.parse(data);
      const { username, age, hobbies } = parsedData;
      if (!username || !age || !hobbies instanceof Array) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Please, enter all required data');
        return;
      }
      const newUser = { ...parsedData, id: uuidv4() };
      users.push(newUser);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newUser));
    });
  }
});

server.listen(port, () => console.log(`Server listened in port ${port}`));
