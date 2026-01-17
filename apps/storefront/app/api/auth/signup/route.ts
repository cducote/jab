import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  // Registration is disabled - only admin can access
  return NextResponse.json(
    { error: "Registration is disabled" },
    { status: 403 }
  );
}
