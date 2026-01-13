import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SECRET_KEY = new TextEncoder().encode("segredo-do-sport-1905");

export async function criarSessao(payload: {
  id: string;
  nome: string;
  role: string;
  fotoUrl?: string;
}) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET_KEY);

  const cookieStore = await cookies();

  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export async function pegarSessao() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as {
      id: string;
      nome: string;
      role: string;
      fotoUrl?: string;
    };
  } catch {
    return null;
  }
}

export async function apagarSessao() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

export async function verificarAdmin() {
  const sessao = await pegarSessao();
  if (!sessao || sessao.role !== "ADMIN") {
    redirect("/login");
  }
  return sessao;
}
