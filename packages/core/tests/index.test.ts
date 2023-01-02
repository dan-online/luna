import { FastifyInstance } from 'fastify';
import { setupTests } from './setupTests';

describe('Luna', () => {
  let app: FastifyInstance;

  setupTests((generatedApp) => {
    app = generatedApp;
  });

  test('GIVEN fastify server THEN responds', async () => {
    const req = await app.inject({
      url: '/',
      method: 'GET'
    });

    expect(req.json()).toEqual({ hello: 'world' });
  });

  test('GIVEN fastify server THEN services are available', async () => {
    const req = await app.inject({
      url: '/status',
      method: 'GET'
    });

    expect(req.json()).toEqual({ status: 'ok' });
  });
});
