import axios from "axios";

describe("Get all users route test", () => {
  test("Should return all users", async () => {
    const users = await axios.get("http://localhost:3000/users");
    console.log("Users data form Axios:");
    console.dir(users.data);

    expect(users).toBeDefined();
  });
});
