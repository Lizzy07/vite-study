import { ResolvedConfig } from '..'
import { Plugin } from '../plugin'

export async function resolvePlugins(
  config: ResolvedConfig,
  prePlugins: Plugin[],
  normalPlugins: Plugin[],
  postPlugins: Plugin[]
): Promise<Plugin[]> {
  return [...prePlugins]
}
