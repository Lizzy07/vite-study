import { Server as HttpServer } from 'http'
import connect from 'connect'
export async function resolveHttpServer(
  app: connect.Server
): Promise<HttpServer> {
  return require('http').createServer(app)
}
