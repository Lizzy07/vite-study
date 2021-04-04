import { IncomingMessage, ServerResponse } from 'http'
import getEtag from 'etag'
import { SourceMap } from 'rollup'

const alias: Record<string, string | undefined> = {
  js: 'application/javascript',
  css: 'text/css',
  html: 'text/html',
  json: 'application/json',
}

export function send(
  req: IncomingMessage,
  res: ServerResponse,
  content: string | Buffer,
  type: string,
  etag = getEtag(content, { weak: true }),
  cacheControl = 'no-cache',
  map?: SourceMap | null
) {
  if (req.headers['if-none-match'] === etag) {
    res.statusCode = 304
    return res.end()
  }

  res.setHeader('Content-Type', alias[type] || type)
  res.setHeader('Cache-Control', cacheControl)
  res.setHeader('Etag', etag)

  res.statusCode = 200
  return res.end(content)
}
