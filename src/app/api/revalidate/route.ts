import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || "dev-secret";

export async function POST(request: NextRequest) {
  // Vérifier le secret en production
  const authHeader = request.headers.get("x-revalidate-secret");
  if (process.env.NODE_ENV === "production" && authHeader !== REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const path = body.path as string | undefined;

    if (path) {
      // Revalider un chemin spécifique
      revalidatePath(path);
    } else {
      // Revalider toutes les pages principales
      revalidatePath("/");
      revalidatePath("/contact");
      revalidatePath("/soins");
      revalidatePath("/a-propos");
      revalidatePath("/entreprise");
      revalidatePath("/mentions-legales");
    }

    return NextResponse.json({ revalidated: true, path: path || "all", now: Date.now() });
  } catch (error) {
    return NextResponse.json({ error: "Revalidation failed" }, { status: 500 });
  }
}
