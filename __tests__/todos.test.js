const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

// Dummy user for testing
const mockUser = {
  email: 'test@example.com',
  password: '12345',
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? mockUser.password;

  // Create an "agent" that gives us the ability
  // to store cookies between requests in a test
  const agent = request.agent(app);

  // Create a user to sign in with
  const user = await UserService.create({ ...mockUser, ...userProps });
  // ...then sign in
  const { email } = user;
  await agent.post('/api/v1/auth/signin').send({ email, password });
  return [agent, user];
};

const mockItemOne = {
  description: 'One fake item'
};
const mockItemTwo = {
  description: 'Second fake item'
};

  
describe('user routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  afterAll(() => {
    pool.end();
  });

  it('adds a new item to the todos list', async () => {
    const [agent, user] = await registerAndLogin();
    const res = await agent.post('/api/v1/shopping').send(mockItemOne);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: expect.any(String),
      user_id: user.id,
      completed: false,
      ...mockItemOne,
    });
  });

  it('displays all items in the list', async () => {
    const [agent] = await registerAndLogin();
    await agent.post('/api/v1/shopping').send(mockItemOne);
    await agent.post('/api/v1/shopping').send(mockItemTwo);

    const res = await agent.get('/api/v1/shopping');

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body).toEqual([
      {
        id: expect.any(String),
        user_id: expect.any(String),
        completed: false,
        ...mockItemOne
      },
      {
        id: expect.any(String),
        user_id: expect.any(String),
        completed: false,
        ...mockItemTwo
      },
    ]);
  });

  // it('updates completed on an item', async () => {
  //   const [agent] = await registerAndLogin();

  //   agent.post('/api/v1/shopping/addItem').send(mockItemOne);
  //   const res = await agent.put('/api/v1/shopping/1').send({ completed: true });

  //   expect(res.status).toBe(200);
  //   expect(res.body).toEqual({
  //     id: expect.any(String),
  //     user_id: expect.any(String),
  //     completed: true,
  //     ...mockItemOne
  //   });
  // });

  // it('deletes an item', async () => {
  //   const [agent] = await registerAndLogin();

  //   agent.post('/api/v1/shopping/addItem').send(mockItemOne);
  //   const res = await agent.delete('/api/v1/shopping/1');

  //   expect(res.status).toBe(204);
  //   expect(res.message).toEqual('Item successfully removed');
  // });
});
