import { readFileSync } from 'node:fs';
export function GET() {
  return new Response(readFileSync(new URL('../../../../presentation/linc-x-mecosin.html', import.meta.url)), { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
