import { faker } from "@faker-js/faker";
import { times } from "lodash";
import { User } from "./mockApi";

export const generateFakeUsers = (numberOfUsers: number = 100): User[] => {
  return times(numberOfUsers, () => ({
    id: faker.datatype.uuid(),
    name: faker.name.fullName(),
    jobTitle: faker.name.jobTitle(),
    address: `${faker.address.streetAddress(
      true
    )}, ${faker.address.city()}, ${faker.address.state()} ${faker.address.zipCode()}`,
    phone: faker.phone.number(),
    email: faker.internet.email(),
    picture: faker.image.avatar(),
  }));
};

export const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
