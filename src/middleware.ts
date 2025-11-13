import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { MiddlewareHandler } from 'astro';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));
const adminDir = path.join(projectRoot, '../public/admin');

const MIME_TYPES: Record<string, string> = {
  html: 'text/html; charset=utf-8',
  js: 'application/javascript; charset=utf-8',
  css: 'text/css; charset=utf-8',
  json: 'application/json; charset=utf-8',
  map: 'application/json; charset=utf-8',
  svg: 'image/svg+xml',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  avif: 'image/avif',
  gif: 'image/gif',
  ico: 'image/x-icon',
  woff: 'font/woff',
  woff2: 'font/woff2',
  ttf: 'font/ttf',
};

const ensureTrailingSlash = (pathname: string) => {
  if (pathname.endsWith('/')) return pathname;
  return path.extname(pathname) ? pathname : `${pathname}/`;
};

const rewriteVisualEditingRequest = (request: Request, url: URL) => {
  const rewritten = new URL(request.url);
  rewritten.pathname = ensureTrailingSlash(url.pathname.replace(/^\/~\//, '/'));
  return new Request(rewritten.toString(), request);
};

const serveAdminAsset = async (pathname: string) => {
  const relative = pathname.replace(/^\/admin\/?/, '') || 'index.html';
  const filePath = path.normalize(path.join(adminDir, relative));

  if (!filePath.startsWith(adminDir)) {
    throw new Error('Attempt to access file outside /public/admin');
  }

  const data = await fs.readFile(filePath);
  const body = new Uint8Array(data);
  const ext = path.extname(filePath).replace('.', '').toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  return new Response(body, {
    headers: {
      'content-type': contentType,
    },
  });
};

export const onRequest: MiddlewareHandler = async ({ request }, next) => {
  const url = new URL(request.url);

  if (url.pathname.startsWith('/~/')) {
    return next(rewriteVisualEditingRequest(request, url));
  }

  if (url.pathname === '/admin') {
    return Response.redirect(`${url.origin}/admin/`, 301);
  }

  if (url.pathname.startsWith('/admin/')) {
    try {
      return await serveAdminAsset(url.pathname);
    } catch (error) {
      console.warn(`[middleware] Unable to serve Admin asset ${url.pathname}`, error);
      return new Response('Not found', { status: 404 });
    }
  }

  return next();
};
