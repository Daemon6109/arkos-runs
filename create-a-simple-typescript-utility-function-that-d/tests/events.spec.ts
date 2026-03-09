import { describe, it, expect } from "bun:test";
import { createEventDebouncer } from "../src/events";
import { EventEmitter } from "events";

describe("createEventDebouncer", () => {
  it("should debounce multiple events into a single call", async () => {
    const emitter = new EventEmitter();
    const calls: any[] = [];
    const handler = (arg: any) => calls.push(arg);
    const wait = 50;

    createEventDebouncer(emitter, "data", handler, wait);

    emitter.emit("data", 1);
    emitter.emit("data", 2);
    emitter.emit("data", 3);

    await new Promise((resolve) => setTimeout(resolve, wait + 10));

    expect(calls.length).toBe(1);
    expect(calls[0]).toBe(3);
  });

  it("should trigger leading edge if options.leading is true", async () => {
    const emitter = new EventEmitter();
    const calls: any[] = [];
    const handler = (arg: any) => calls.push(arg);
    const wait = 50;

    createEventDebouncer(emitter, "data", handler, wait, { leading: true });

    emitter.emit("data", "a");
    expect(calls.length).toBe(1);
    expect(calls[0]).toBe("a");

    calls.length = 0;
    emitter.emit("data", "b");

    await new Promise((resolve) => setTimeout(resolve, wait + 10));
    expect(calls.length).toBe(0);
  });

  it("should handle multiple different events separately", async () => {
    const emitter = new EventEmitter();
    const calls1: any[] = [];
    const calls2: any[] = [];
    const handler1 = (arg: any) => calls1.push(arg);
    const handler2 = (arg: any) => calls2.push(arg);
    const wait = 50;

    createEventDebouncer(emitter, "event1", handler1, wait);
    createEventDebouncer(emitter, "event2", handler2, wait);

    emitter.emit("event1", "x");
    emitter.emit("event2", "y");

    await new Promise((resolve) => setTimeout(resolve, wait + 10));

    expect(calls1.length).toBe(1);
    expect(calls1[0]).toBe("x");
    expect(calls2.length).toBe(1);
    expect(calls2[0]).toBe("y");
  });

  it("should clean up timeout when emitter is destroyed", async () => {
    const emitter = new EventEmitter();
    const calls: any[] = [];
    const handler = (arg: any) => calls.push(arg);
    const wait = 50;

    createEventDebouncer(emitter, "data", handler, wait);
    emitter.emit("data", 1);

    // Simulate destruction by removing all listeners
    emitter.removeAllListeners("data");
    emitter.emit("data", 2);

    await new Promise((resolve) => setTimeout(resolve, wait + 10));
    expect(calls.length).toBe(1);
    expect(calls[0]).toBe(1);
  });
});