import { cookies } from "next/headers";

type User = {
  username: string;
  token: string;
  role?: "edit" | "readonly";
};

export class UserManager {
  private users: User[];

  constructor() {
    this.users = [];
  }

  setUsers(users: User[]) {
    this.users = users;
  }

  public isValidToken(token: string | null | undefined): boolean {
    if (!token) {
      return false;
    }

    return this.users.some((user) => user.token === token);
  }

  public getUser(token: string): User | undefined {
    return this.users.find((user) => user.token === token);
  }

  public getCurrentUser() {
    const userToken = cookies().get("ws_u")?.value;

    if (!userToken) {
      return undefined;
    }

    return this.getUser(userToken);
  }

  public static createUserManagerUsingEnvVariable() {
    const usersString = process.env.ADMIN_USERS;
    if (!usersString) {
      throw new Error("No token provided");
    }

    const userManager = new UserManager();

    userManager.setUsers(JSON.parse(usersString));

    return userManager;
  }
}
