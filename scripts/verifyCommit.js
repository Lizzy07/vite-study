const chalk = require('chalk')
// git的commit msg 文件的路径： .git/COMMIT_EDITMSG
const msgPath = process.env.GIT_PARAMS
//读取到commit的内容
const msg = require('fs').readFileSync(msgPath, 'utf-8').trim()
const commitRE = /^(revert:)?(feat|fix|docs|dx|style|refactor|perf|test|workflow|build|ci|chore|types|wip|release)(\(.+\))?: .{1,50}/
if (!commitRE.test(msg)) {
  console.error(`
  ${chalk.bgRed.white(' ERROR ')}
  ${chalk.red('invalid commit message format.')}
  ${chalk.red(
    'Proper commit message format is required for automated changelog generations. Examples:'
  )}
      ${chalk.green('feat(compiler): add comments option')}
      ${chalk.green('fix(v-model): handle events on blur (close #28)')}
      ${chalk.red('See .github/commit-convention.md for more details.')}
  `)
  process.exit(1)
}
