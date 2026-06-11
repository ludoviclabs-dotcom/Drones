import { NextResponse } from "next/server";
import { panoplieSafetyGuard } from "@/lib/panoplie-safety";

export async function GET() {
  return NextResponse.json({
    name: "Panoplie Safety Boundary",
    nonOperational: true,
    scope:
      "OSINT stratégique : coûts, sources, supply chain, export public, géopolitique et méthodologie.",
    blocked:
      "Ciblage, emploi tactique, optimisation d'arme, fabrication, contournement export et battlefield management.",
  });
}

export async function POST(request: Request) {
  let input = "";

  try {
    const body = (await request.json()) as { input?: unknown; prompt?: unknown };
    input =
      typeof body.input === "string"
        ? body.input
        : typeof body.prompt === "string"
          ? body.prompt
          : "";
  } catch {
    input = "";
  }

  const result = panoplieSafetyGuard(input);
  const status =
    result.allowed || result.category === "ambigue_a_recadrer" ? 200 : 403;

  return NextResponse.json(result, { status });
}
