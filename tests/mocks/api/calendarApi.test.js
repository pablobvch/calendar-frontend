import calendarApi from "../../../src/api/calendarApi";

describe("calendarApi tests", () => {
  test("it should have the default configuration", async () => {
    expect(calendarApi.defaults.baseURL).toBe(process.env.VITE_API_URL);
  });
  test("it should have the x-token in header of all requests", async () => {
    const token = "ABC-123";
    localStorage.setItem("token", token);
    const res = await calendarApi("/auth");
    expect(res.config.headers["x-token"]).toBe(token);
  });
});
