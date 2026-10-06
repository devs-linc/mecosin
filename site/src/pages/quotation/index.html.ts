import { readFileSync } from 'node:fs';
export function GET() {
  return new Response(readFileSync(new URL('../../../../presentation/quotation.html', import.meta.url)), { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
