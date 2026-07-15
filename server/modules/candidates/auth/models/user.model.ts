import { randomUUID } from "crypto";

type User = {
  id: string;
  fullName: string;
  email: string;
  password: string;
};

const users: User[] = [];

export async function findUserByEmail(email: string) {
  return users.find((user) => user.email === email) || null;
}

export async function findUserById(id: string) {
  return users.find((user) => user.id === id) || null;
}

export async function createUser(data: { fullName: string; email: string; password: string }) {
  const user = {
    id: randomUUID(),
    fullName: data.fullName,
    email: data.email,
    password: data.password,
  };

  users.push(user);
  return user;
}
