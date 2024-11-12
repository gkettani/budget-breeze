import { getServerSession } from "next-auth/next";
import { authOptions } from "~/server/auth";

// This can only be used in server-side code
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  return session?.user;
}