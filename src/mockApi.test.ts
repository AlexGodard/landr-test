import { expect, test } from "vitest";
import { UsersAPI } from "./mockApi";
import { generateFakeUsers } from "./helpers";

test("should correctly add a user", async () => {
  const usersAPI = new UsersAPI(100);
  const user = generateFakeUsers(1)[0];
  await usersAPI.createUser(user);
  expect(usersAPI.users).toContain(user);
  expect(usersAPI.users.length).toBe(101);
});

test("should correctly delete a user", async () => {
  const usersAPI = new UsersAPI(100);
  const user = usersAPI.users[0];
  await usersAPI.deleteUser(user.id);
  expect(usersAPI.users).not.toContain(user);
  expect(usersAPI.users.length).toBe(99);
});

test("should throw an error during deletion if the user does not exist", async () => {
  const usersAPI = new UsersAPI(100);
  const user = generateFakeUsers(1)[0];
  await expect(usersAPI.deleteUser(user.id)).rejects.toThrow(
    "The user you are trying to delete does not exist."
  );
});

test("should correctly update a user", async () => {
  const usersAPI = new UsersAPI(100);
  const user = usersAPI.users[0];
  const updatedUser = { ...user, name: "John Doe" };
  await usersAPI.updateUser(updatedUser);
  expect(usersAPI.users).toContain(updatedUser);
  expect(usersAPI.users.length).toBe(100);
});

test("should correctly get all users", async () => {
  const usersAPI = new UsersAPI(100);
  const users = await usersAPI.getUsers();
  expect(users.length).toBe(100);
});
