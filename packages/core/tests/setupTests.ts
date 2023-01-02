import { FastifyInstance } from 'fastify';
import { setTimeout } from 'timers/promises';
import { start } from '../src';
import { exitHandler } from '../src/utils/catchExit';

let app: FastifyInstance;

export function setupTests(cb: (app: FastifyInstance) => void) {
  beforeAll(async () => {
    if (app) return cb(app);
    app = await start();
    cb(app);

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
}
