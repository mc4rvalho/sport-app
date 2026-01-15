import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// MELHORIA: Tenta pegar do .env primeiro. Se não tiver, usa o fallback (perigoso em prod).
const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "segredo-do-sport-1905"
);

export async function criarSessao(payload: {
  id: string;
  nome: string;
  role: string;
  fotoUrl?: string;
}) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // Sessão dura 7 dias
    .sign(SECRET_KEY);

  const cookieStore = await cookies();

  cookieStore.set("session", token, {
    httpOnly: true, // Impede acesso via JavaScript (XSS)
    secure: process.env.NODE_ENV === "production", // Só HTTPS em produção
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
    // Retorna os dados tipados
    return payload as {
      id: string;
      nome: string;
      role: string;
      fotoUrl?: string;
    };
  } catch {
    return null; // Token inválido ou expirado
  }
}

export async function apagarSessao() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

// Middleware de proteção para Server Components
export async function verificarAdmin() {
  const sessao = await pegarSessao();

  if (!sessao || sessao.role !== "ADMIN") {
    redirect("/login");
  }

  return sessao;
}
