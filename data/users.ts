export const validUser = {
  username: 'ammarhamdy010@gmail.com',
  password: 'Admin#123'
};


export const invalidUsers = [
  {
    username: 'wrongUser',
    password: 'wrongPass',
    reason: 'wrong username and password'
  },
  {
    username: '',
    password: 'password123',
    reason: 'empty username'
  },
  {
    username: 'admin',
    password: '',
    reason: 'empty password'
  },
  {
    username: 'admin',
    password: 'short',
    reason: 'invalid password format'
  }
];
