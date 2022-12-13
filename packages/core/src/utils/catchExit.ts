import { log } from './log';

process.stdin.resume();

const handlers: (() => void)[] = [];

function attemptClear() {
  try {
    process.stdout.clearLine(-1);
    process.stdout.cursorTo(0);
  } catch {}
}

function exitHandler(options: { cleanup?: boolean; exit?: boolean }) {
  if (options.cleanup && handlers.length > 0) {
    log.info(`[proc] cleaning up ${handlers.length} handlers`);

    attemptClear();

    handlers.forEach((handler) => handler());
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
