/**
 * @description: 扩展 package.json
 */

const isObject = (val) => val && typeof val === 'object'

export function extendPackage(pkg, fields) {
  for (const key in fields) {
      const value = fields[key]
      const existing = pkg[key]
      if (isObject(value) && (key === 'dependencies' || key === 'devDependencies' || key === 'scripts')) {
          pkg[key] = Object.assign(existing || {}, value)
      } else {
          pkg[key] = value
      }
  }
}
