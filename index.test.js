import { fromDate } from ".";
const fs = require("fs");

describe("flowtime", () => {
  it("should map to known flowtime values", () => {
    const data = fs.readFileSync("test_data.csv", "utf-8");
    const lines = data.split("\n").filter((line) => line); // filter out any empty lines

    const actuals = [];
    const expected = [];

    lines.forEach((line) => {
      const [dateStr, timeStr] = line.split(",");
      const [hour, minute, second] = timeStr.split(":").map(Number);

      actuals.push(fromDate(new Date(dateStr)));
      expected.push({ hour, minute, second });
    });

    expect(actuals).toMatchObject(expected);
  });

  it("should return every hour and minute combinations of flowtime only once per day", () => {
    const actuals = [];
    const expected = [];

    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m++) {
        const hh = h.toString().padStart(2, "0");
        const mm = m.toString().padStart(2, "0");
        actuals.push(fromDate(new Date(`2000-01-01T${hh}:${mm}:00`)));
        expected.push({ hour: h, minute: m, second: 0 });
      }
    }

    const actualsSort = actuals.sort(
      (a, b) => a.hour - b.hour || a.minute - b.minute || a.second - b.second,
    );

    expect(actualsSort).toMatchObject(expected);
  });

  it("should convert flowtime to date object", () => {
    const now = new Date();
    const flowtime = fromDate(now);
    const flowdate = flowtime.toDate();

    expect(flowdate.getFullYear()).toEqual(now.getFullYear());
    expect(flowdate.getMonth()).toEqual(now.getMonth());
    expect(flowdate.getDate()).toEqual(now.getDate());
    expect(flowdate.getHours()).toEqual(flowtime.hour);
    expect(flowdate.getMinutes()).toEqual(flowtime.minute);
    expect(flowdate.getSeconds()).toEqual(flowtime.second);
  });
});
