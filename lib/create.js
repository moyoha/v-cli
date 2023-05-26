import path from 'path'
import { globby } from 'globby'
import ejs from 'ejs'
import fs from 'fs-extra'
import answers from './prompt.js'
import { extendPackage } from './utils/extendPackage.js'
import sortObject from './utils/sortObject.js'
import { isBinaryFileSync } from 'isbinaryfile'
import { $ } from 'execa'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { cwd } from 'process'

// 因为使用 ESModule，所以需要自己定义 __filename 和 __dirname 变量
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function create(name) {

  // 填入 vue webpack 必选项，无需用户选择
  answers.features.unshift('vue', 'webpack')

  console.log(answers)
  // package.json 文件内容
  let pkg = {
    name,
    version: '1.0.0',
    dependencies: {},
    devDependencies: {},
  }

  // 根据用户选择的选项加载相应的模块，在 package.json 写入对应的依赖项
  for(let feature of answers.features) {
    const result = await import(`./generator/${feature}/index.js`)
    extendPackage(pkg, result.default(answers))
  }

  pkg = sortPkg(pkg)
  console.log(pkg)

  let template_file_paths = []

  console.log(__dirname)
  // 获取所需要的模版的文件路径
  for(let feature of answers.features) {
    console.log(feature)
    const feature_file_paths = await globby([`generator/${feature}/template/**/*`], { dot: true, cwd: __dirname})
    // console.log(feature_file_paths)
    template_file_paths = [...template_file_paths, ...feature_file_paths]
  }

  console.log({template_file_paths})
  for(let file of template_file_paths) {
    const render_file = renderFile(`${__dirname}/${file}`, answers)


    const filepath = file.split('template/')[1]
    const filename = `${name}/${filepath}`
    console.log(filepath)
    fs.ensureDirSync(path.dirname(filename))
    fs.writeFileSync(filename, render_file)
  }

  // 保存 package.json 到项目的根目录下
  // fs.ensureDirSync(path.dirname(`${name}/package.json`))
  fs.writeFileSync(`${name}/package.json`, JSON.stringify(pkg, null, 2))

  // 下载依赖
  // console.log(await $`pwd`)
  console.log("\n正在下载依赖...\n")
  console.log(await $({cwd: `${process.cwd()}/${name}`})`npm install`)
  console.log('\n依赖下载完成! 执行下列命令开始开发：\n')
  console.log(`cd ${name}`)
  console.log(`npm run dev`)
}


// 按照下面的顺序对 package.json 中的 key 进行排序
function sortPkg(pkg) {
  // 按照 ascii 进行排序
  pkg.dependencies = sortObject(pkg.dependencies)
  pkg.devDependencies = sortObject(pkg.devDependencies)

  // 按照指定顺序进行排序
  pkg.scripts = sortObject(pkg.scripts, [
      'dev',
      'build',
      'test:unit',
      'test:e2e',
      'lint',
      'deploy',
  ])

  return sortObject(pkg, [
      'name',
      'version',
      'private',
      'description',
      'author',
      'scripts',
      'husky',
      'lint-staged',
      'main',
      'module',
      'browser',
      'jsDelivr',
      'unpkg',
      'files',
      'dependencies',
      'devDependencies',
      'peerDependencies',
      'vue',
      'babel',
      'eslintConfig',
      'prettier',
      'postcss',
      'browserslist',
      'jest',
  ])
}

function renderFile(source, data = {}, options = {}) {
  // 如果是二进制文件，直接将读取结果返回
  if(isBinaryFileSync(source)) {
    return fs.readFileSync(source)
  }
  const template = fs.readFileSync(source, 'utf-8')
  return ejs.render(template, data, options)
}