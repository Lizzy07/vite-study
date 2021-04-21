import fs from 'fs'
import getEtag from 'etag'
import { cleanUrl } from '../utils'
import { ViteDevServer } from '../server'
import path from 'path'
export interface TransformResult {
  code: string
  etag?: string
  deps?: string[]
}

export interface TransformOptions {
  ssr?: boolean
  html?: boolean
}

export async function transformRequest(
  url: string,
  { config, pluginContainer }: ViteDevServer,
  options: TransformOptions = {}
): Promise<TransformResult | null> {
  // resolve
  const id = (await pluginContainer.resolveId(url))?.id || url
  const file = cleanUrl(id)

  let code: string | null = null
  // load
  const loadResult = await pluginContainer.load(id)
  if (loadResult == null) {
    // try fallback loading it from fs as string
    // if the file is a binary, there should be a plugin that already loaded it
    // as string
    try {
      code = fs.readFileSync(file, 'utf-8')
      console.log(code)
    } catch (e) {
      if (e.code !== 'ENOENT') {
        throw e
      }
    }
  } else {
    if (typeof loadResult === 'object') {
      code = loadResult.code
    } else {
      code = loadResult
    }
  }
  if (code == null) {
    throw new Error(
      `Failed to load url ${url} (resolved id: ${id}). ` +
        `This file is in /public and will be copied as-is during build without ` +
        `going through the plugin transforms, and therefore should not be ` +
        `imported from source code. It can only be referenced via HTML tags.`
    )
  }
  // transform
  const transformResult = await pluginContainer.transform(code, id)
  if (
    transformResult == null ||
    (typeof transformResult === 'object' && transformResult.code == null)
  ) {
  } else {
    code = transformResult.code!
  }

  return {
    code,
    etag: getEtag(code, { weak: true }),
  } as TransformResult
}
