import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

type NetworkConfig = {
  name: string;
  routes: Record<string, string>;
};

function badRequest(message: string, details?: unknown) {
  return NextResponse.json(
    { error: message, details },
    { status: 400 }
  );
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const input = searchParams.get("input")?.trim();
    const shouldRedirect = searchParams.get("redirect");

    if (!input) {
      return badRequest("Missing 'input' query param. Expected format a:b:c");
    }

    const parts = input.split(":");
    if (parts.length !== 3) {
      return badRequest("Invalid input format. Expected a:b:c");
    }

    const [a, b, c] = parts;

    if (!/^\d+$/.test(a)) {
      return badRequest("'a' must be a numeric id of the JSON file");
    }
    if (!b) {
      return badRequest("'b' (value) is required");
    }
    if (!c) {
      return badRequest("'c' (route key) is required");
    }

    // Construct absolute path to data file: data/<a>.json (at project root or under src?)
    // We'll use project root `/data` per user request
    const dataDir = path.join(process.cwd(), "data");
    const filePath = path.join(dataDir, `eip155-${a}.json`);

    let json: NetworkConfig;
    try {
      const file = await fs.readFile(filePath, "utf8");
      json = JSON.parse(file) as NetworkConfig;
    } catch (err) {
      return badRequest("Network config not found or invalid JSON", { id: a });
    }

    const template = json.routes?.[c];
    if (!template) {
      return badRequest("Route key not found in network config", { key: c });
    }

    const resolved = template.replaceAll("{value}", b);

    if (shouldRedirect) {
      // Issue a server-side redirect to the resolved URL
      return NextResponse.redirect(resolved);
    }

    return NextResponse.json({ url: resolved, network: json.name });
  } catch (error) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}


