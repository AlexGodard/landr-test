import invariant from "tiny-invariant";
import { delay, generateFakeUsers } from "./helpers";

export type User = {
  id: string;
  name: string;
  jobTitle: string;
  address: string;
  phone: string;
  email: string;
  picture: string;
};

export class UsersAPI {
  users: User[];

  constructor(numberOfUsers: number = 100) {
    this.users = generateFakeUsers(numberOfUsers);
  }

  // Create a user
  public createUser = async (user: User) => {
    await delay(400);
    this.users.unshift(user);
    return user;
  };

  // Get all users
  public getUsers = async () => {
    await delay(400);
    return this.users;
  };

  // Delete a user by id
  public deleteUser = async (id: string): Promise<User> => {
    await delay(400);
    const deletedUser = this.users.find((user) => user.id === id);
    invariant(deletedUser, "The user you are trying to delete does not exist.");
    this.users = this.users.filter((user) => user.id !== id);
    return deletedUser;
  };

  // Updates a user by id
  public updateUser = async (user: User): Promise<User> => {
    await delay(400);
    const index = this.users.findIndex((u) => u.id === user.id);
    this.users[index] = user;
    return user;
  };
}
