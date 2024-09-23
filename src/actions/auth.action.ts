"use server";

import db from "@/lib/db";
import bcrypt from "bcrypt";
import {
  SignInFormData,
  SignUpFormData,
  SignUpFormSchema,
} from "@/lib/schemas";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { lucia } from "@/lib/auth/lucia";
import { getAuth } from "@/lib/auth/getAuth";
import { CreateErrorResponse } from "@/lib/response.server";
import { Prisma } from ".prisma/client";

enum Role {
  User = "user",
  Admin = "admin",
}

export async function signUp(user: SignUpFormData) {
  const validatedFields = SignUpFormSchema.safeParse(user);

  if (!validatedFields.success) {
    return CreateErrorResponse("Validation error");
  }

  const validatedUser = validatedFields.data;
  try {
    const hashedPassword = await bcrypt.hash(validatedUser.password, 10);
    const createdUser = await db.user.create({
      data: {
        username: validatedUser.username,
        email: validatedUser.email,
        password: hashedPassword,
        role: Role.User,
      },
    });

    const session = await lucia.createSession(createdUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
  } catch (error) {
    const prismaError = error as Prisma.PrismaClientKnownRequestError;
    if (prismaError?.code === "P2002") {
      return CreateErrorResponse("User already exists");
    } else {
      return CreateErrorResponse("Failed to create user");
    }
  }
  redirect("/dashboard");
}

export async function signIn(user: SignInFormData) {
  const checkedUser = await db.user.findUnique({
    where: { email: user.email },
  });

  if (!checkedUser) {
    return CreateErrorResponse("User dose not exists");
  }
  const validPassword = await bcrypt.compare(
    user.password,
    checkedUser.password,
  );
  if (!validPassword) {
    return CreateErrorResponse("Wrong password");
  }

  try {
    const session = await lucia.createSession(checkedUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
  } catch (error) {
    return CreateErrorResponse("Failed to login user");
  }
  redirect("/dashboard");
}

export const signOut = async () => {
  const { session } = await getAuth();

  if (!session) {
    redirect("/signin");
  }

  console.log("in signout ");
  try {
    await lucia.invalidateSession(session.id);

    const sessionCookie = lucia.createBlankSessionCookie();

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
  } catch (error) {
    return CreateErrorResponse("Failed to logout user");
  }

  redirect("/signin");
};
