import { EventEmitter } from 'events';
import { debounce } from './debounce';
import { DebounceOptions } from './types';

export function createEventDebouncer<T extends EventEmitter>(
  emitter: T,
  event: string,
  options: { wait: number } & DebounceOptions
): EventEmitter {
  const debouncedEmitter = new EventEmitter();
  const { wait, ...debounceOptions } = options;
  const debouncedEmit = debounce(
    (args: unknown[]) => {
      debouncedEmitter.emit(event, ...args);
    },
    wait,
    debounceOptions
  );

  emitter.on(event, (...args) => {
    debouncedEmit(args);
  });

  return debouncedEmitter;
}