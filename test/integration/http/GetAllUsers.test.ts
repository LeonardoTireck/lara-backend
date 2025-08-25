import axios from "axios";

test("Should return all users", async () => {
  const users = await axios.get("http://localhost:3000/users");
  console.log("Users data form Axios:", users.data);

  expect(users).toBeDefined();
});
