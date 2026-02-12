import { LocalProviderConfig, LocalStorageProvider } from '#infra/local_storage_provider'
import { StorageProviderInterface } from '#shared/application/services/upload/storage_provider_interface'
import env from '#start/env'

export enum ProviderType {
  VERCEL = 'VERCEL',
  LOCAL = 'LOCAL',
}

export type ProviderConfig = { type: ProviderType.LOCAL; config: LocalProviderConfig }

export class StorageProviderFactory {
  /**
   * Create a storage provider based on configuration
   */
  static createProvider(providerConfig: ProviderConfig): StorageProviderInterface {
    switch (providerConfig.type) {
      // case ProviderType.S3:
      //   return new S3StorageProvider(providerConfig.config)

      // case ProviderType.AZURE:
      //   return new AzureStorageProvider(providerConfig.config)

      case ProviderType.LOCAL:
        return new LocalStorageProvider(providerConfig.config)

      default:
        throw new Error(`Unknown provider type: ${(providerConfig as any).type}`)
    }
  }

  /**
   * Create provider from environment variables
   */
  static createFromEnv(): StorageProviderInterface {
    const providerType = process.env.STORAGE_PROVIDER as ProviderType

    if (!providerType) {
      throw new Error('STORAGE_PROVIDER environment variable is not set')
    }

    switch (providerType) {
      // case ProviderType.S3:
      //   return new S3StorageProvider({
      //     accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      //     region: process.env.AWS_REGION || 'us-east-1',
      //     bucket: process.env.AWS_BUCKET || '',
      //     basePath: process.env.STORAGE_BASE_PATH,
      //   })

      // case ProviderType.AZURE:
      //   return new AzureStorageProvider({
      //     accountName: process.env.AZURE_STORAGE_ACCOUNT || '',
      //     accountKey: process.env.AZURE_STORAGE_KEY || '',
      //     containerName: process.env.AZURE_CONTAINER || '',
      //     basePath: process.env.STORAGE_BASE_PATH,
      //   })

      case ProviderType.LOCAL:
        return new LocalStorageProvider({
          storagePath: env.get('STORAGE_BASE_PATH') || './storage',
          baseUrl: env.get('LOCAL_STORAGE_URL') || 'http://localhost:3000/uploads',
          basePath: env.get('STORAGE_BASE_PATH'),
          imageBasePath: env.get('IMAGE_STORAGE_BASE_PATH'),
          documentBasePath: env.get('DOCUMENT_STORAGE_BASE_PATH'),
        })

      default:
        throw new Error(`Unknown provider type: ${providerType}`)
    }
  }
}
