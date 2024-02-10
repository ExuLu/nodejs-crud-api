import { createServer } from 'http';

const port = 3000;
const server = createServer((req, res) => {
  res.write('Hello');
  res.end();
});

server.listen(port, () => console.log(`Server listened in port ${port}`));
