import { createServerActionProcedure } from "zsa";
import { auth } from "../auth";
import { headers } from "next/headers";

export const authenticatedAction = createServerActionProcedure().handler(
  async () => {
    try {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      if (!session) {
        throw new Error("User not authenticated");
      }
      return {
        user: session.user,
      };
    } catch {
      throw new Error("User not authenticated");
    }
  },
);
