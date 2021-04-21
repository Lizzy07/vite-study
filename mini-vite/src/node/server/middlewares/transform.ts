import { Connect } from 'types/connect'
import { ViteDevServer } from '..'
import { isJSRequest } from '../../utils'
import { send } from '../../send'
import { transformRequest } from '../transformRequest'
import { DEP_CACHE_DIR, DEP_VERSION_RE } from '../../constants'

const knownIgnoreList = new Set(['/', '/favicon.ico'])

export function transformMiddleware(
  server: ViteDevServer
): Connect.NextHandleFunction {
  return async (req, res, next) => {
    if (req.method !== 'GET' || knownIgnoreList.has(req.url!)) {
      return next()
    }
    try {
      let url = req.url!
      if (isJSRequest(url)) {
        // resolve, load and transform using the plugin container
        const result = await transformRequest(url, server, {
          html: req.headers.accept?.includes('text/html'),
        })
        if (result) {
          const type = 'js'
          const isDep =
            DEP_VERSION_RE.test(url) ||
            url.includes(`node_modules/${DEP_CACHE_DIR}`)
          return send(
            req,
            res,
            result.code,
            type,
            result.etag,
            // allow browser to cache npm deps!
            isDep ? 'max-age=31536000,immutable' : 'no-cache'
          )
        }
      }
    } catch (e) {
      return next(e)
    }
    next()
  }
}
