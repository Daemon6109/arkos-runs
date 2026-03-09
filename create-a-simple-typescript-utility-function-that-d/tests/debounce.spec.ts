import { describe, it, expect } from "bun:test";
import { debounce } from "../src/debounce";
import { DebounceOptions } from "../src/types";

describe("debounce", () => {
  it("should call the function once after the wait time", async () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);
    debounced();
    await new Promise((resolve) => setTimeout(resolve, 150));
    expect(fn).toHaveBeenCalledOnce();
  });

  it("should reset the timer on subsequent calls", async () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);
    debounced();
    await new Promise((resolve) => setTimeout(resolve, 50));
    debounced();
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(fn).toHaveBeenCalledOnce();
  });

  it("should call immediately when leading edge is true", async () => {
    const fn = vi.fn();
    const options: DebounceOptions = { leading: true };
    const debounced = debounce(fn, 100, options);
    debounced();
    expect(fn).toHaveBeenCalledOnce();
    fn.mockClear();
    debounced();
    await new Promise((resolve) => setTimeout(resolve, 150));
    expect(fn).not.toHaveBeenCalled();
  });

  it("should cancel the debounce", async () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);
    debounced();
    const cancel = debounce.cancel();
    cancel();
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(fn).not.toHaveBeenCalled();
  });
});