import * as http from 'http'
import connect from 'connect'
import { resolveConfig, InlineConfig, ResolvedConfig } from '../config'
import { resolveHttpServer } from './http'
import {
  createDevHtmlTransformFn,
  indexHtmlMiddleware,
} from './middlewares/indexHtml'
import { transformMiddleware } from './middlewares/transform'
import { createPluginContainer, PluginContainer } from '../pluginContainer'
import { Connect } from 'types/connect'

export type ServerHook = (
  server: ViteDevServer
) => (() => void) | void | Promise<(() => void) | void>

export interface ViteDevServer {
  /**
   * 解析后的vite配置
   */
  config: ResolvedConfig
  /**
   * 一个connect app实例
   * 能够给dev server添加自定义中间件
   */
  middlewares: Connect.Server
  /**
   * 本地的http server实例，在中间件模式下是null
   */
  httpServer: http.Server
  /**
   * rollup 插件容器能够运行插件的hooks
   */
  pluginContainer: PluginContainer
  transformIndexHtml(url: string, html: string): Promise<string>
  listen(port?: number, isRestart?: boolean): Promise<ViteDevServer>
}

export async function createServer(
  inlineConfig: InlineConfig = {}
): Promise<ViteDevServer> {
  const config = await resolveConfig(inlineConfig, 'serve', 'development')
  const middlewares = connect()
  const httpServer = await resolveHttpServer(middlewares)
  const container = await createPluginContainer(config)
  const server: ViteDevServer = {
    config,
    middlewares,
    httpServer,
    pluginContainer: container,
    transformIndexHtml: null as any,
    listen(port?: number, isRestart?: boolean) {
      return startServer(server, port, isRestart)
    },
  }

  // main transform middleware
  middlewares.use(transformMiddleware(server))

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
