import { expect, test } from "vitest";
import { compress, decompress } from "../../src/App.utils";

const values = new Map();

values.set("string1", "eJwrLinKzEs3BAAMCwLJ");
values.set("", "eJwDAAAAAAE=");
values.set("\n", "eJzjAgAACwAL");
values.set(JSON.stringify({ value: "value" }), "eJyrVipLzClNVbKC0rUANbEF9Q==");

test("compress", () => {
  values.forEach((compressed, value) => {
    expect(compress(value)).toBe(compressed);
  });
});

test("decompress", () => {
  values.forEach((compressed, value) => {
    expect(decompress(compressed)).toBe(value);
  });
});
