# nodejs-crud-api

Welcome to the app!

To install all you need:

```
npm i
```

To start app:

```
npm run start:dev
```

To test app:
```
npm run test
```

You can exit an app or tests with ctrl + C.

To get all users you need to send GET request to http://localhost:4000/users
To get one users you need to send GET request to http://localhost:4000/users/userId, where userId is id of user you want to get
To create new user you need to send POST request to http://localhost:4000/users and in body you need to add JSON file with fields: username, age, hobbies
To update user you need to send GET request to http://localhost:4000/users/userId, where userId is id of user you want to update and in body you need to add JSON file with fields you want to update
To delete user you need to send DELETE request to http://localhost:4000/users/userId, where userId is id of user you want to delete