import * as http from 'http'
import connect from 'connect'
import { resolveConfig, InlineConfig, ResolvedConfig } from '../config'
import { resolveHttpServer } from './http'

export interface ViteDevServer {
  config: ResolvedConfig
  httpServer: http.Server
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
    listen(port?: number, isRestart?: boolean) {
      return startServer(server, port, isRestart)
    },
  }
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
