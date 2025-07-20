import { invoke } from "@tauri-apps/api/core";
import { User } from "./types";

export async function signupUser(
  username: string,
  email: string,
  password: string
) {
  try {
    await invoke("signup_user", {
      data: {
        username,
        email,
        password,
      },
    });
    console.log("Signup successful!");
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const user = await invoke<User>("login_user", {
      data: { email, password },
    });
    return user;
  } catch (err: any) {
    throw new Error(err);
  }
}
