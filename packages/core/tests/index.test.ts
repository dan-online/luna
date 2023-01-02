import { FastifyInstance } from 'fastify';
import { setTimeout } from 'node:timers/promises';
import { start } from '../src/index';
import { exitHandler } from '../src/utils/catchExit';

describe('Luna', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await start();
  });

  test('GIVEN fastify server THEN responds', async () => {
    const req = await app.inject({
      url: '/',
      method: 'GET'
    });

    expect(req.json()).toEqual({ hello: 'world' });
  });

  test('GIVEN mongo and redis THEN app connects', async () => {
    const getReq = async () => {
      const req = await app.inject({
        url: '/status',
        method: 'GET'
      });

      const json = req.json<{ status: string }>();

      if (json.status === 'ok') {
        return json;
      }

      await setTimeout(1);

      return getReq();
    };

    const json = await getReq();

    expect(json).toEqual({ status: 'ok' });
  });

  afterAll(async () => {
    await app.close();
    exitHandler({ cleanup: true, exit: false });
  });
});
