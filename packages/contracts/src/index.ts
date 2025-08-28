// Export all schemas
export * from './schemas/menu'
export * from './schemas/cart'
export * from './schemas/price'

// Export registry for OpenAPI generation
export { registry } from './registry'

// Legacy export for backward compatibility
export const contractsReady = () => true
