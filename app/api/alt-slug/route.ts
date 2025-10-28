// app/api/alt-slug/route.ts
import { NextResponse } from 'next/server';
import { getAlternatePostSlug } from '@lib/contentful';

export const runtime = 'nodejs'; // ensure Node runtime

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug') || '';
  const from = searchParams.get('from') || 'en';
  const to = searchParams.get('to') || 'es';

  if (!slug) {
    return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
  }

  try {
    const alt = await getAlternatePostSlug(slug, from, to);
    return NextResponse.json({ slug: alt });
  } catch (e: any) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
