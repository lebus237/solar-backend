import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import {
  FileInfo,
  MediaType,
  UploadOptions,
  UploadResult,
} from '#shared/application/services/upload/types'
import { cuid as uuidv4 } from '@adonisjs/core/helpers'
import { StorageProviderInterface } from '#shared/application/services/upload/provider_interface'
import { MultipartFile } from '@adonisjs/core/bodyparser'

export interface LocalProviderConfig {
  storagePath: string
  baseUrl: string // e.g., 'http://localhost:3000/uploads'
  basePath?: string
  imageBasePath?: string
  documentBasePath?: string
}

export class LocalStorageProvider implements StorageProviderInterface {
  private storagePath: string
  private baseUrl: string
  private basePath: string
  private imageBasePath?: string
  private documentBasePath?: string

  constructor(config: LocalProviderConfig) {
    this.storagePath = config.storagePath
    this.baseUrl = config.baseUrl
    this.basePath = config.basePath || 'uploads'
    this.imageBasePath = config.imageBasePath
    this.documentBasePath = config.documentBasePath
    this.ensureStorageDirectory()
  }

  private async ensureStorageDirectory(): Promise<void> {
    const fullPath = path.join(this.storagePath, this.basePath)
    try {
      await fs.access(fullPath)
    } catch {
      await fs.mkdir(fullPath, { recursive: true })
    }
  }

  async upload(
    fileInfo: FileInfo,
    file: MultipartFile,
    _options?: UploadOptions
  ): Promise<UploadResult> {
    try {
      const fileName = this.generateFileName(fileInfo.originalName)
      const relativeKey = path.join(
        fileInfo.type === MediaType.IMAGE
          ? (this.imageBasePath as string)
          : (this.documentBasePath as string),
        fileName
      )

      // Write file
      await file.moveToDisk(relativeKey)

      const url = file.meta.url

      return {
        success: true,
        url,
        key: relativeKey,
        metadata: {
          originalName: fileInfo.originalName,
          size: fileInfo.size,
          mimeType: fileInfo.mimeType,
          uploadedAt: new Date(),
        },
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      }
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      const filePath = path.join(this.storagePath, key)
      const metaPath = `${filePath}.meta.json`

      await fs.unlink(filePath)

      // Try to delete metadata file (ignore if doesn't exist)
      try {
        await fs.unlink(metaPath)
      } catch {}

      return true
    } catch (error) {
      console.error('Delete failed:', error)
      return false
    }
  }

  async getSignedUrl(key: string, expiresIn?: number): Promise<string> {
    // For local storage, we just return the public URL
    // In production, you might implement token-based access
    console.log('Getting signed URL for', key, expiresIn)
    return `${this.baseUrl}/${key}`
  }

  async exists(key: string): Promise<boolean> {
    try {
      const filePath = path.join(this.storagePath, key)
      await fs.access(filePath)
      return true
    } catch {
      return false
    }
  }

  async getMetadata(key: string): Promise<Record<string, any> | null> {
    try {
      const filePath = path.join(this.storagePath, key)
      const metaPath = `${filePath}.meta.json`

      const [stats, metaContent] = await Promise.all([
        fs.stat(filePath),
        fs.readFile(metaPath, 'utf-8').catch(() => null),
      ])

      const metadata = metaContent ? JSON.parse(metaContent) : {}

      return {
        size: stats.size,
        lastModified: stats.mtime,
        ...metadata,
      }
    } catch (error) {
      return null
    }
  }

  private generateFileName(originalName: string): string {
    const timestamp = Date.now()
    const uuid = uuidv4()
    const extension = originalName.split('.').pop()
    return `${timestamp}-${uuid}.${extension}`
  }
}
