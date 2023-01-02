import { log } from './log';

const handlers: (() => void)[] = [];

function attemptClear() {
  try {
    process.stdout.clearLine(-1);
    process.stdout.cursorTo(0);
  } catch {}
}

export function exitHandler(options: { cleanup?: boolean; exit?: boolean }) {
  if (options.cleanup && handlers.length > 0) {
    process.stdin.resume();

    if (process.env.NODE_ENV !== 'test') attemptClear();
    log.info(`[proc] cleaning up ${handlers.length} handlers`);

    handlers.forEach((handler) => handler());
    if (!process.argv.find((arg) => arg === '--watch')) process.stdin.pause();
  }

  if (options.exit) process.exit();
}

export function addExitHandler(handler: () => void) {
  handlers.push(handler);
}

process.on('exit', exitHandler.bind(null, { cleanup: true }));

process.on('SIGINT', exitHandler.bind(null, { exit: true }));
process.on('SIGTERM', exitHandler.bind(null, { exit: true }));

process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));

// process.on('uncaughtException', exitHandler.bind(null, { exit: false }));
