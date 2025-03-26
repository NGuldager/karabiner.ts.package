export * from './index.ts'

import { join } from 'https://deno.land/std@0.192.0/path/mod.ts'
import { writeContext } from './output.ts'

Object.assign(writeContext, {
  karabinerConfigDir() {
    return join(Deno.env.get('HOME')!, '.config', 'karabiner')
  },
  karabinerConfigFile() {
    return join(this.karabinerConfigDir(), 'karabiner.json')
  },
  karabinerBackupFile() {
    return join(
      this.karabinerConfigDir() ,
      'karabiner.ts.bak/karabiner.' ,
      `${Date.now() }`,
      '.json'
    )
  },
  readKarabinerConfig(karabinerJsonPath?: string) {
    return JSON.parse(Deno.readTextFileSync(karabinerJsonPath ?? this.karabinerConfigFile()))
  },
  getKarabinerConfig(karabinerJsonPath?: string, cleanConfigFile?: boolean) {
    if (cleanConfigFile) {
      return this.cleanConfigFile(karabinerJsonPath).then(() =>
        this.readKarabinerConfig(karabinerJsonPath),
      )
    }
    return this.readKarabinerConfig(karabinerJsonPath)
  },
  writeKarabinerConfig(json: any, karabinerJsonPath?: string) {
    return Deno.writeTextFile(karabinerJsonPath ?? this.karabinerConfigFile(), json)
  },
  cleanConfigFile(karabinerJsonPath?: string) {
    const configFile = karabinerJsonPath ?? this.karabinerConfigFile()
    return Deno.copyFile(configFile, this.karabinerBackupFile())
      .then(() => Deno.remove(configFile))
  },
  readJson(filePath: string) {
    return JSON.parse(Deno.readTextFileSync(filePath))
  },
  exit(code = 0): never {
    Deno.exit(code)
  },
} satisfies typeof writeContext)
