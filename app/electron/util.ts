import fs from 'fs/promises'
import path from 'path'

export async function getPackageJson() {
  return await fs
    .readFile(path.join(__dirname, '../../package.json'), 'utf8')
    .then((data) => {
      return JSON.parse(data)
    })
    .catch((err) => console.error(err))
}
