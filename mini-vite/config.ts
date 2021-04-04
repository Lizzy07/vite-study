import { type } from "os"

export type PluginOption = Plugin | false | null | undefined
export interface UserConfig {
    // 项目根目录（index.html文件所在的位置）。可以是一个绝对路径，或者相对于该配置文件本身的路径。
    //  默认值：process.cwd()
    root?: string
    // 开发或生产环境的公共基础路径。
    // 默认值：/
    base?: string
    // 静态资源服务的文件夹。会被拷贝到outDir的根目录，不转换文件
    // 默认值： public
    publicDir?: string
    // 默认值： development（开发模式）， production（生产模式）
    mode?: string
    // 定义全局变量替换的方式。配置的每一项内容会在开发环境时，被定义在window对象上，在构建时，会静态替换该内容。
    // 插曲：Record是一个ts的内置范型，https://zhuanlan.zhihu.com/p/281408210
    define?: Record<string, any>
    // 将要用到的插件数组
    plugins?: (PluginOption | PluginOption[])[]
}
export interface InlineConfig extends UserConfig {}

export type ResolvedConfig = Readonly<
    Omit<UserConfig, 'plugins' | 'alias' | 'dedupe' | 'assetsInclude'> & {
        configFile: string | undefined
    }
>