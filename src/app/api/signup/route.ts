import { NextResponse } from "next/server";

interface RequestBody {
  username: string;
  email: string;
  password: string;
}

export async function POST(req: Request) {
  const { username, email, password }: RequestBody = await req.json();

  const response = await fetch(`${process.env.BACKEND_BASE_URL}/auth/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password }),
  });

  console.log(JSON.stringify(response))

  if (response.ok) {
    return NextResponse.json(
      { message: "User created successfully" },
      { status: response.status },
    );
  }

  const res = await response.json();
  console.log(res);
  return NextResponse.json({ message: res }, { status: response.status });
}
