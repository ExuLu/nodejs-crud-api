import { v4 as uuidv4 } from 'uuid';

const users = [
  {
    id: uuidv4(),
    username: 'littlepony',
    age: 19,
    hobbies: ['Collect butterflies', 'Play in rock band'],
  },
  {
    id: uuidv4(),
    username: 'littlefoxy',
    age: 25,
    hobbies: ['Hunting', 'Eating'],
  },
];
export default users;
