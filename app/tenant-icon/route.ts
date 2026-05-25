import { rentFlowTenantIconResponse } from "@/src/lib/server-icon";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  return rentFlowTenantIconResponse(request);
}
