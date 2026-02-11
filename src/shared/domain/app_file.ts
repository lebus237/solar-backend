import { MultipartFile } from '@adonisjs/core/bodyparser'
import { readFile } from 'node:fs/promises'

export class AppFile {
  constructor(public readonly file: MultipartFile) {}

  public async getBuffer(): Promise<Buffer> {
    return await readFile(this.file.tmpPath!)
  }

  get originalName(): string {
    return this.file.clientName
  }
  get size(): number {
    return this.file.size
  }

  get mimeType(): any {
    return `${this.file.type}/${this.file.subtype}`
  }

  get metadata(): any {
    return this.file.meta
  }

  public getFile() {
    return this.file
  }
}
