import { Plugin as RollupPlugin } from 'rollup'
import { UserConfig } from './config'
import { ResolvedConfig } from './'

export interface ConfigEnv {
  command: 'build' | 'serve'
  mode: string
}

export interface Plugin extends RollupPlugin {
  enforce?: 'pre' | 'post'
  apply?: 'serve' | 'build'
  config?: (config: UserConfig, env: ConfigEnv) => UserConfig | null | void
  configResolved?: (config: ResolvedConfig) => void
}
