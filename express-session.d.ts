import "express-session";

declare module "express-session" {
  interface Session {
    passport: {
      user: {
        id: string;
        displayName: string;
        email: string;
      };
    };
  }
}
