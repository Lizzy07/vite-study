import {
  // InputOptions,
  PartialResolvedId,
  SourceDescription,
  // PluginContext as RollupPluginContext,
  LoadResult,
} from 'rollup'
import { ResolvedConfig } from '.'
export interface PluginContainer {
  // options: InputOptions
  // buildStart(options: InputOptions): Promise<void>
  resolveId(id: string): Promise<PartialResolvedId | null>
  transform(code: string, id: string): Promise<SourceDescription | null>
  load(id: String): Promise<LoadResult | null>
  // close(): Promise<void>
}

export async function createPluginContainer({
  plugins,
}: ResolvedConfig): Promise<PluginContainer> {
  const container: PluginContainer = {
    async resolveId(rawId) {
      return null
    },
    async load(id) {
      return null
    },
    async transform(code, id) {
      for (const plugin of plugins) {
        if (!plugin.transform) continue
      }
      return {
        code,
      }
    },
  }
  return container
}
