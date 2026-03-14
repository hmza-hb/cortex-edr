import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth/options";

const handler = NextAuth(authOptions);

// Next.js 15 strictly typed route handler wrapper
export const GET = handler as any;
export const POST = handler as any;
