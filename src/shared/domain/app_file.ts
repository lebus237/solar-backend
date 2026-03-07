import { MultipartFile } from '@adonisjs/core/bodyparser'
import { readFile } from 'node:fs/promises'
import { DomainError } from '#shared/domain/errors/domain_error'

export class AppFile {
  public file: MultipartFile
  constructor(_file: MultipartFile | null) {
    if (_file === null) {
      throw new DomainError('IMAGE_FILE_REQUIRED_ERROR', 'Image file is required')
    }
    this.file = _file
  }

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
    return `${this.file?.type}/${this.file?.subtype}`
  }

  get metadata(): any {
    return this.file.meta
  }

  public getFile() {
    return this.file
  }
}
