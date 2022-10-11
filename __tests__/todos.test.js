const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const agent = await request(app).agent;
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
    const res = agent.post('/api/v1/shopping').send(mockItemOne);
    
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: expect.any(String),
      user_id: expect.any(String),
      completed: false,
      ...mockItemOne
    });
  });

  it('displays all items in the list', async () => {
    agent.post('/api/v1/shopping').send(mockItemOne);
    agent.post('/api/v1/shopping').send(mockItemTwo);

    const res = agent.get('/api/v1/shopping');

    expect(res.status).toBe(200);
    expect(res.length).toBe(2);
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

  it('updates completed on an item', async () => {
    agent.post('/api/v1/shopping').send(mockItemOne);
    const res = agent.put('/api/v1/shopping/1').send({ completed: true });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: expect.any(String),
      user_id: expect.any(String),
      completed: true,
      ...mockItemOne
    });
  });

  it('deletes an item', async () => {
    agent.post('/api/v1/shopping').send(mockItemOne);
    const res = agent.delete('/api/v1/shopping/1');

    expect(res.status).toBe(204);
    expect(res.message).toEqual('Item successfully removed');
  });
});
