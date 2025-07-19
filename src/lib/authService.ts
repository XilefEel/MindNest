import { invoke } from "@tauri-apps/api/core";
import { User } from "../context/AuthContext";

export type SignupData = {
  username: string;
  email: string;
  password: string;
};

export type LoginData = {
  email: string;
  password: string;
};

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
    const user = (await invoke("login_user", {
      data: { email, password },
    })) as User;
    return user;
  } catch (err: any) {
    throw new Error(err);
  }
}
