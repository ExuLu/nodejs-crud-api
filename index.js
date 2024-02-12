import { createServer } from 'http';
import users from './utils/users.js';
import { validate, v4 as uuidv4 } from 'uuid';

const port = process.env.PORT || 4000;

let workUsers = users;
const server = createServer((req, res) => {
  const { url, method } = req;
  req.on('error', (err) => {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Oops! Something went wrong');
  });
  if (url === '/users' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(workUsers));
    return;
  }
  if (url.includes('/users/') && method === 'GET') {
    const id = url.slice(url.lastIndexOf('/') + 1);
    const isUUID = validate(id);
    if (!isUUID) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('The id has wrong format');
      return;
    }
    const user = workUsers.find((use) => use.id === id);

    if (user) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(user));
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('There is no user with such id');
    }
    return;
  }
  if (url.includes('/users') && method === 'POST') {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => {
      let parsedData;
      try {
        parsedData = JSON.parse(data);
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Oops! Something went wrong');
        return;
      }
      const { username, age, hobbies } = parsedData;
      if (!username || !age) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Please, enter all required data');
        return;
      }
      if (!hobbies && hobbies != []) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Please, enter all required data');
        return;
      }
      const newUser = { ...parsedData, id: uuidv4() };
      workUsers.push(newUser);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newUser));
    });
    return;
  }
  if (url.includes('/users/') && method === 'PUT') {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => {
      let parsedData;
      try {
        parsedData = JSON.parse(data);
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Oops! Something went wrong');
        return;
      }
      const { username, hobbies, age } = parsedData;
      const id = url.slice(url.lastIndexOf('/') + 1);
      const isUUID = validate(id);
      if (!isUUID) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('The id has wrong format');
        return;
      }
      const editUser = workUsers.find((user) => user.id === id);
      if (!editUser) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('There is no user with such id');
        return;
      }

      if (username) editUser.username = username;
      if (hobbies instanceof Array) editUser.hobbies = hobbies;
      if (age) editUser.age = age;

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(editUser));
    });
    return;
  }

  if (url.includes('/users/') && method === 'DELETE') {
    const id = url.slice(url.lastIndexOf('/') + 1);
    const isUUID = validate(id);
    if (!isUUID) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('The id has wrong format');
      return;
    }
    const deleteUser = workUsers.find((user) => user.id === id);
    if (!deleteUser) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('There is no user with such id');
      return;
    }

    const withoutUser = workUsers.filter((user) => user.id !== id);
    workUsers = withoutUser;

    res.writeHead(204);
    res.end();
    return;
  }
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Oops! Try to change url or method');
});

server.listen(port, () => console.log(`Server listened in port ${port}`));

export default server;
