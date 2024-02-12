const { v4: uuidv4 } = require('uuid');

const users = [
  {
    id: uuidv4(),
    username: 'littlepony',
    age: 19,
    hobbies: ['Collect butterflies', 'Play in rock band'],
  },
];
export default users;
