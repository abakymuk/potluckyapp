import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { readdirSync, statSync } from 'node:fs'

const pkgsDir = join(process.cwd(), 'packages')
const pkgs = readdirSync(pkgsDir).filter((d) => statSync(join(pkgsDir, d)).isDirectory())

let ok = true
for (const p of pkgs) {
  const pkgPath = join(pkgsDir, p, 'package.json')
  const pkg = JSON.parse(await readFile(pkgPath, 'utf8'))
  const required = ['name', 'main', 'module', 'types', 'exports', 'scripts']
  const missing = required.filter((k) => !(k in pkg))
  if (missing.length) {
    console.error(`Package ${pkg.name || p} missing fields: ${missing.join(', ')}`)
    ok = false
  }
}

process.exit(ok ? 0 : 1)
