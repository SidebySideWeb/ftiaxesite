/**
 * Test script to diagnose CMS connection issues
 * Run with: pnpm tsx scripts/test-cms-connection.ts
 */

import 'dotenv/config'
import { getApiClient } from '../lib/api-client'

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
      const client = getApiClient()
      
      // Try to fetch the home page
      console.log('  📄 Fetching home page...')
      const page = await client.getPage('ftiaxesite-homepage')
      
      if (page) {
        console.log('  ✅ Success!')
        console.log('  📊 Results:')
        console.log(`    - Page slug: ${(page as any).slug}`)
        console.log(`    - Page title: ${(page as any).title}`)
        console.log(`    - Page type: ${(page as any).pageType}`)
        const sections = (page as any).sections || (page as any).content?.sections
        console.log(`    - Has sections: ${!!sections}`)
        console.log(`    - Has hero: ${!!sections?.hero}`)
        console.log(`    - Has features: ${!!sections?.features}`)
        console.log(`    - Has process: ${!!sections?.process}`)
        console.log(`    - Has contact: ${!!sections?.contact}`)
        
        // Check richText fields
        if (sections?.hero?.subheadline) {
          const subheadline = sections.hero.subheadline
          console.log(`    - Hero subheadline type: ${typeof subheadline}`)
          if (typeof subheadline === 'object') {
            console.log(`    - Hero subheadline is Lexical JSON: ${!!subheadline.root}`)
          }
        }
      } else {
        console.log('  ⚠️  No page found!')
        console.log('  💡 Make sure the ftiaxesite tenant has a ftiaxesite-homepage in the CMS')
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
    const client = getApiClient()
    const tenant = await client.getTenant()
    
    console.log('  📊 Tenant Results:')
    
    if (tenant) {
      console.log(`    - Tenant slug: ${tenant.slug}`)
      console.log(`    - Tenant ID: ${tenant.id}`)
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

