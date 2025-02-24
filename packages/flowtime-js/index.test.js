import test from "node:test";
import assert from "node:assert/strict";
import { fromDate } from "./index.js";
import fs from "fs";

test("should map to known flowtime values", () => {
  const data = fs.readFileSync("test_data.csv", "utf-8");
  const lines = data.split("\n").filter((line) => line);

  lines.forEach((line) => {
    const [dateStr, timeStr] = line.split(",");
    const [hour, minute, second] = timeStr.split(":").map(Number);
    const date = new Date(dateStr);
    const flowtime = fromDate(date);

    assert.equal(flowtime.hour, hour);
    assert.equal(flowtime.minute, minute);
    assert.equal(flowtime.second, second);
    assert.equal(flowtime.date.getHours(), hour);
    assert.equal(flowtime.date.getMinutes(), minute);
  });
});

test("should map each hour and minute pair once per day", () => {
  const actuals = [];
  const expected = [];

  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m++) {
      const date = new Date("2000-01-01");
      date.setHours(h, m);
      const flowtime = fromDate(date);
      actuals.push({
        hour: flowtime.hour,
        minute: flowtime.minute,
      });
      expected.push({ hour: h, minute: m });
    }
  }

  const actualsSort = actuals.sort(
    (a, b) => a.hour - b.hour || a.minute - b.minute
  );

  assert.deepStrictEqual(actualsSort, expected);
});
