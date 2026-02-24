import { User } from "../types/user";
import { setItem, getItem, deleteItem } from "./storage";

export async function saveUserSession(user: User) {
  return setItem("user", user);
}

export async function getUserSession(): Promise<User | null> {
  return getItem<User>("user");
}

export async function clearUserSession() {
  return deleteItem("user");
}
