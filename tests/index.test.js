import server from '../index.js';
import request from 'supertest';

const user = {
  username: 'littlefairy',
  age: 15,
  hobbies: ['Fly', 'Cleaning'],
};

const url = '/users';

describe('API tests', () => {
  test('GET request should return data', async () => {
    const result = await request(server).get(url);

    expect(result.status).toBe(200);
    expect(result.body).toEqual([]);
  });

  test('Create new user with POST method', async () => {
    const result = await request(server).post(url).send(user);

    expect(result.status).toBe(201);
    expect(result.body).toEqual({ ...user, id: result.body.id });
  });

  test('Get user by id', async () => {
    const newUser = await request(server).post(url).send(user);
    const id = newUser.body.id;
    const userURL = `${url}/${id}`;
    const result = await request(server).get(userURL);

    expect(result.status).toBe(200);
    expect(result.body).toEqual({ ...user, id });
  });

  test('Update user with PUT method', async () => {
    const existedUser = await request(server).post(url).send(user);
    const id = existedUser.body.id;
    const userURL = `${url}/${id}`;
    const updatedUser = {
      username: 'fairy',
      age: 17,
      hobbies: ['Painting', 'Swimming'],
    };

    const result = await request(server).put(userURL).send(updatedUser);
    expect(result.status).toBe(200);
    expect(result.body).toEqual({ ...updatedUser, id });
  });

  test('Delete user with DELETE method', async () => {
    const newUser = await request(server).post(url).send(user);
    const id = newUser.body.id;
    const userURL = `${url}/${id}`;
    const result = await request(server).delete(userURL);

    expect(result.status).toBe(204);
  });

  test('Should return error for non-existing user', async () => {
    const newUser = await request(server).post(url).send(user);
    const id = newUser.body.id;
    const userURL = `${url}/${id}`;
    await request(server).delete(userURL);
    const getUser = await request(server).get(userURL);

    expect(getUser.status).toBe(404);
  });
});
