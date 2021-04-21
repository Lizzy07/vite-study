import path from 'path'
import os from 'os'

export function slash(p: string): string {
  return p.replace(/\\/g, '/')
}

export const queryRE = /\?.*$/
export const hashRE = /#.*$/

export const cleanUrl = (url: string) =>
  url.replace(hashRE, '').replace(queryRE, '')

const isWindows = os.platform() === 'win32'
export function normalizePath(id: string): string {
  return path.posix.normalize(isWindows ? slash(id) : id)
}

const knownJsSrcRE = /\.((j|t)sx?|mjs|vue)($|\?)/

export const isJSRequest = (url: string) => {
  if (knownJsSrcRE.test(url)) {
    return true
  }
  url = cleanUrl(url)
  if (!path.extname(url) && !url.endsWith('/')) {
    return true
  }
  return false
}
