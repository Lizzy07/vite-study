import { ViteDevServer } from '..'
import path from 'path'
import fs from 'fs'
import { send } from '../../send'
import { Connect } from 'types/connect'
import { applyHtmlTransforms } from '../../plugins/html'

function getHtmlFilename(url: string, server: ViteDevServer) {
  return path.join(server.config.root, url.slice(1))
}

export function createDevHtmlTransformFn(server: ViteDevServer) {
  return (url: string, html: string): Promise<string> => {
    return applyHtmlTransforms(html, url, getHtmlFilename(url, server), [])
  }
}

export function indexHtmlMiddleware(
  server: ViteDevServer
): Connect.NextHandleFunction {
  return async (req, res, next) => {
    const url = req.url
    if (url?.endsWith('.html') && req.headers['sec-fetch-dest'] !== 'script') {
      const filename = getHtmlFilename(url, server)
      if (fs.existsSync(filename)) {
        try {
          let html = fs.readFileSync(filename, 'utf-8')
          html = await server.transformIndexHtml(url, html)
          return send(req, res, html, 'html')
        } catch (e) {
          return next(e)
        }
      }
    }
  }
}
