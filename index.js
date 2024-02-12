import { createServer } from 'http';
import users from './utils/users.js';
import { validate, v4 as uuidv4 } from 'uuid';

const port = 3000;
const server = createServer((req, res) => {
  const { url, method } = req;
  req.on('error', (err) => {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Oops! Something went wrong');
  });
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
  if (url.includes('/users/') && method === 'PUT') {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => {
      try {
        const parsedData = JSON.parse(data);
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
      const editUser = users.find((user) => user.id === id);
      if (!editUser) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('There is no user with such id');
        return;
      }

      if (username) editUser.username = username;
      if (hobbies instanceof Array) editUser.hobbies = hobbies;
      if (age) editUser.age = age;

      let newUsers = users;
      const usersWithoutNewUser = users.filter((user) => user.id !== id);
      newUsers = { ...usersWithoutNewUser, editUser };

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(editUser));
    });
  }

  if (url.includes('/users/') && method === 'DELETE') {
    const id = url.slice(url.lastIndexOf('/') + 1);
    const isUUID = validate(id);
    if (!isUUID) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('The id has wrong format');
      return;
    }
    const deleteUser = users.find((user) => user.id === id);
    if (!deleteUser) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('There is no user with such id');
      return;
    }

    let newUsers = users;
    const usersWithoutDeleteUser = users.filter((user) => user.id !== id);
    newUsers = usersWithoutDeleteUser;

    res.writeHead(204, { 'Content-Type': 'text/plain' });
    res.end(JSON.stringify('User have been deleted'));
  }
});

server.listen(port, () => console.log(`Server listened in port ${port}`));
