import { invoke } from "@tauri-apps/api/core";
import { User } from "../types/user";

export async function signupUser(
  username: string,
  email: string,
  password: string,
) {
  invoke<void>("signup_user", {
    data: {
      username,
      email,
      password,
    },
  });
}

export async function loginUser(email: string, password: string) {
  return await invoke<User>("login_user", {
    data: { email, password },
  });
}
