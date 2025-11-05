/**
 * Test script to diagnose CMS connection issues
 * Run with: pnpm tsx scripts/test-cms-connection.ts
 */

import 'dotenv/config'
import { createClientWithTenant } from '../lib/payload-client'

async function testCMSConnection() {
  console.log('🔍 Testing CMS Connection...\n')

  // Check environment variables
  console.log('📋 Environment Variables:')
  console.log('  NEXT_PUBLIC_PAYLOAD_URL:', process.env.NEXT_PUBLIC_PAYLOAD_URL || 'NOT SET')
  console.log('  NEXT_PUBLIC_TENANT_SLUG:', process.env.NEXT_PUBLIC_TENANT_SLUG || 'NOT SET')
  console.log('')

  if (!process.env.NEXT_PUBLIC_PAYLOAD_URL) {
    console.error('❌ NEXT_PUBLIC_PAYLOAD_URL is not set!')
    console.log('\n💡 Set it in your .env.local file:')
    console.log('   NEXT_PUBLIC_PAYLOAD_URL=https://cms.ftiaxesite.gr')
    process.exit(1)
  }

  // Test different hostnames
  const testHostnames = [
    'ftiaxesite.gr',
    'www.ftiaxesite.gr',
    'localhost',
    'localhost:3000',
  ]

  for (const hostname of testHostnames) {
    console.log(`\n🌐 Testing with hostname: "${hostname}"`)
    console.log('─'.repeat(50))

    try {
      const client = createClientWithTenant(hostname)
      
      // Try to fetch the home page
      console.log('  📄 Fetching home page...')
      const result = await client.getPage('home')
      
      console.log('  ✅ Success!')
      console.log('  📊 Results:')
      console.log(`    - Total docs: ${result.docs?.length || 0}`)
      
      if (result.docs && result.docs.length > 0) {
        const page = result.docs[0]
        console.log(`    - Page slug: ${page.slug}`)
        console.log(`    - Page title: ${page.title}`)
        console.log(`    - Page type: ${page.pageType}`)
        console.log(`    - Has sections: ${!!page.sections}`)
        console.log(`    - Has hero: ${!!page.sections?.hero}`)
        console.log(`    - Has features: ${!!page.sections?.features}`)
        console.log(`    - Has process: ${!!page.sections?.process}`)
        console.log(`    - Has contact: ${!!page.sections?.contact}`)
        console.log(`    - Has footer: ${!!page.sections?.footer}`)
        
        // Check richText fields
        if (page.sections?.hero?.subheadline) {
          const subheadline = page.sections.hero.subheadline
          console.log(`    - Hero subheadline type: ${typeof subheadline}`)
          if (typeof subheadline === 'object') {
            console.log(`    - Hero subheadline is Lexical JSON: ${!!subheadline.root}`)
          }
        }
      } else {
        console.log('  ⚠️  No pages found!')
        console.log('  💡 Make sure the ftiaxesite tenant has a home page in the CMS')
      }
    } catch (error) {
      console.error('  ❌ Error:', error instanceof Error ? error.message : String(error))
      if (error instanceof Error && 'stack' in error) {
        console.error('  Stack:', error.stack)
      }
    }
  }

  // Test tenant lookup
  console.log('\n\n🔍 Testing Tenant Lookup...')
  console.log('─'.repeat(50))
  
  try {
    const client = createClientWithTenant('ftiaxesite.gr')
    const tenantResult = await client.getTenant()
    
    console.log('  📊 Tenant Results:')
    console.log(`    - Total docs: ${tenantResult.docs?.length || 0}`)
    
    if (tenantResult.docs && tenantResult.docs.length > 0) {
      const tenant = tenantResult.docs[0]
      console.log(`    - Tenant slug: ${tenant.slug}`)
      console.log(`    - Tenant name: ${tenant.name}`)
      console.log(`    - Tenant domain: ${tenant.domain || 'NOT SET'}`)
      console.log(`    - Template: ${tenant.template || 'NOT SET'}`)
    } else {
      console.log('  ⚠️  No tenant found!')
      console.log('  💡 Make sure the ftiaxesite tenant exists in the CMS')
    }
  } catch (error) {
    console.error('  ❌ Error:', error instanceof Error ? error.message : String(error))
  }

  console.log('\n✅ Test complete!\n')
}

testCMSConnection().catch(console.error)

