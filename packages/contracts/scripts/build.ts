/* eslint-env node */
import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi'
import { registry } from '../src/registry'
import { writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function generateOpenApi() {
  const generator = new OpenApiGeneratorV3(registry.definitions)
  
  const docs = generator.generateDocument({
    openapi: '3.1.0',
    info: {
      title: 'Potlucky API',
      version: '1.0.0',
      description: 'API for online ordering system',
    },
    servers: [
      {
        url: 'https://api.potlucky.com',
        description: 'Production server',
      },
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  })

  const outputPath = resolve(__dirname, '../dist/openapi.json')
  writeFileSync(outputPath, JSON.stringify(docs, null, 2))
  
  // eslint-disable-next-line no-console
  console.log('✅ OpenAPI documentation generated:', outputPath)
}

generateOpenApi().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('❌ Failed to generate OpenAPI:', error)
  process.exit(1)
})
