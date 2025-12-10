import { NextResponse } from 'next/server';
import dns from 'dns/promises';

export async function GET() {
  const result: any = { ok: true };

  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? null;
  result.env = {
    NEXT_PUBLIC_SUPABASE_URL: !!rawUrl,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  };

  if (!rawUrl) {
    result.ok = false;
    result.message = 'NEXT_PUBLIC_SUPABASE_URL is not set';
    return NextResponse.json(result, { status: 500 });
  }

  // Normalize URL (remove trailing slash)
  const base = rawUrl.replace(/\/+$/g, '');
  let host: string;
  try {
    const u = new URL(base);
    host = u.host;
  } catch (e: any) {
    result.ok = false;
    result.message = 'NEXT_PUBLIC_SUPABASE_URL is not a valid URL';
    result.error = String(e?.message ?? e);
    return NextResponse.json(result, { status: 500 });
  }

  // DNS lookup
  try {
    const addresses = await dns.lookup(host, { all: true });
    result.dns = { resolved: true, addresses };
  } catch (e: any) {
    result.dns = { resolved: false, error: String(e?.message ?? e) };
    result.ok = false;
  }

  // Try fetching the root of the project and the auth token endpoint (no credentials)
  try {
    const rootResp = await fetch(base, { method: 'GET' });
    result.fetchRoot = { ok: rootResp.ok, status: rootResp.status };
  } catch (e: any) {
    result.fetchRoot = { ok: false, error: String(e?.message ?? e) };
    result.ok = false;
  }

  try {
    const tokenUrl = `${base}/auth/v1/token?grant_type=refresh_token`;
    const tokenResp = await fetch(tokenUrl, { method: 'GET' });
    result.fetchToken = { ok: tokenResp.ok, status: tokenResp.status };
  } catch (e: any) {
    result.fetchToken = { ok: false, error: String(e?.message ?? e) };
    result.ok = false;
  }

  return NextResponse.json(result);
}
