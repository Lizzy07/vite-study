import {
  CustomPluginOptions,
  LoadResult,
  Plugin as RollupPlugin,
  ResolveIdResult,
  PluginContext,
  TransformPluginContext,
  TransformResult,
} from 'rollup'
import { UserConfig } from './config'
import { ResolvedConfig } from './'
import { ServerHook } from './server'
import { IndexHtmlTransform } from './plugins/html'

export interface ConfigEnv {
  command: 'build' | 'serve'
  mode: string
}
/**
 * vite 插件是基于 rollup插件开发的，扩展了一些自己独有的功能。
 */
export interface Plugin extends RollupPlugin {
  /**
   * 插件顺序
   * 一个vite插件可以额外指定一个enforce属性来调整它的应用顺序。解析后的插件按照以下顺序排列：
   * 1、alias resolution
   * 2、带有enforce: 'pre'的用户插件
   * 3、vite内置插件
   * 4、没有enforce值的用户插件
   * 5、vite构建用的插件
   * 6、带有enforce: 'post'的用户插件
   */
  enforce?: 'pre' | 'post'
  /**
   * 表明该插件仅适用与开发或构建过程
   */
  apply?: 'serve' | 'build'
  /**
   * vite独有钩子
   * 在被解析之前修改vite配置
   */
  config?: (config: UserConfig, env: ConfigEnv) => UserConfig | null | void
  /**
   * vite独有钩子
   * 在解析vite配置之后调用。使用这个钩子读取和存储最终解析的配置。
   */
  configResolved?: (config: ResolvedConfig) => void
  /**
   * vite独有钩子
   * 是用于配置开发服务器的钩子。最常见的用例是在内部connect应用程序中添加自定义中间件。
   * 该钩子会在内部中间件被安装前调用，所以，自定义中间件将比内部中间件早运行。
   * 如果你想注入一个在内部中间件之后运行的中间件，你可以从configureServer返回一个函数，将会在内部中间件安装后被调用。
   */
  configureServer?: ServerHook
  transformIndexHtml?: IndexHtmlTransform
  resolveId?(
    this: PluginContext,
    source: string,
    importer: string | undefined,
    options: { custom?: CustomPluginOptions }
  ): Promise<ResolveIdResult> | ResolveIdResult
  load?(this: PluginContext, id: string): Promise<LoadResult> | LoadResult
  transform?(
    this: TransformPluginContext,
    code: string,
    id: string
  ): Promise<TransformResult> | TransformResult
}
