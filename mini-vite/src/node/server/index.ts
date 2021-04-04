import * as http from 'http'
import connect from 'connect'
import { resolveConfig, InlineConfig, ResolvedConfig } from '../config'
import { resolveHttpServer } from './http'
import {
  createDevHtmlTransformFn,
  indexHtmlMiddleware,
} from './middlewares/indexHtml'

export interface ViteDevServer {
  config: ResolvedConfig
  httpServer: http.Server
  transformIndexHtml(url: string, html: string): Promise<string>
  listen(port?: number, isRestart?: boolean): Promise<ViteDevServer>
}

export async function createServer(
  inlineConfig: InlineConfig = {}
): Promise<ViteDevServer> {
  const config = await resolveConfig(inlineConfig, 'serve', 'development')
  const middlewares = connect()
  const httpServer = await resolveHttpServer(middlewares)
  const server: ViteDevServer = {
    config,
    httpServer,
    transformIndexHtml: null as any,
    listen(port?: number, isRestart?: boolean) {
      return startServer(server, port, isRestart)
    },
  }

  server.transformIndexHtml = createDevHtmlTransformFn(server)

  middlewares.use(indexHtmlMiddleware(server))
  if (httpServer) {
    // overwrite listen to run optimizer before server start
  }
  return server
}

async function startServer(
  server: ViteDevServer,
  inlinePort?: number,
  isRestart?: boolean
): Promise<ViteDevServer> {
  const httpServer = server.httpServer
  if (!httpServer) {
    throw new Error('Cannot call server.listen in middleware mode.')
  }
  let port = inlinePort || 3000
  return new Promise((resolve, reject) => {
    httpServer.listen(port, () => {
      console.log('server is listening:' + port)
    })
  })
}
