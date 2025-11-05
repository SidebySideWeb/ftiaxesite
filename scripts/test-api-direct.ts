/**
 * Test API directly to see what the frontend receives
 */

async function testAPIDirect() {
  const baseUrl = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'https://cms.ftiaxesite.gr'
  const tenantDomain = 'ftiaxesite.gr'
  
  console.log('🔍 Testing API directly...\n')
  console.log(`Base URL: ${baseUrl}`)
  console.log(`Tenant Domain: ${tenantDomain}\n`)

  // Test 1: Query by tenant.domain
  console.log('📡 Test 1: Query by tenant.domain')
  console.log('─'.repeat(50))
  
  const url1 = `${baseUrl}/api/pages?where=${encodeURIComponent(JSON.stringify({
    slug: { equals: 'home' },
    'tenant.domain': { equals: tenantDomain },
  }))}&limit=1&depth=2`
  
  console.log(`URL: ${url1}\n`)
  
  try {
    const response1 = await fetch(url1)
    const data1 = await response1.json()
    
    console.log(`Status: ${response1.status}`)
    console.log(`Total docs: ${data1.docs?.length || 0}`)
    
    if (data1.docs && data1.docs.length > 0) {
      const page = data1.docs[0]
      console.log(`✅ Page found: ${page.slug}`)
      console.log(`   Has sections: ${!!page.sections}`)
      console.log(`   Has hero: ${!!page.sections?.hero}`)
      console.log(`   Has features: ${!!page.sections?.features}`)
      console.log(`   Has process: ${!!page.sections?.process}`)
      console.log(`   Has contact: ${!!page.sections?.contact}`)
    } else {
      console.log('❌ No pages found')
    }
  } catch (error) {
    console.error('❌ Error:', error)
  }

  // Test 2: Query by tenant.slug
  console.log('\n\n📡 Test 2: Query by tenant.slug')
  console.log('─'.repeat(50))
  
  const url2 = `${baseUrl}/api/pages?where=${encodeURIComponent(JSON.stringify({
    slug: { equals: 'home' },
    'tenant.slug': { equals: 'ftiaxesite' },
  }))}&limit=1&depth=2`
  
  console.log(`URL: ${url2}\n`)
  
  try {
    const response2 = await fetch(url2)
    const data2 = await response2.json()
    
    console.log(`Status: ${response2.status}`)
    console.log(`Total docs: ${data2.docs?.length || 0}`)
    
    if (data2.docs && data2.docs.length > 0) {
      const page = data2.docs[0]
      console.log(`✅ Page found: ${page.slug}`)
      console.log(`   Has sections: ${!!page.sections}`)
      console.log(`   Has hero: ${!!page.sections?.hero}`)
      console.log(`   Has features: ${!!page.sections?.features}`)
      console.log(`   Has process: ${!!page.sections?.process}`)
      console.log(`   Has contact: ${!!page.sections?.contact}`)
    } else {
      console.log('❌ No pages found')
    }
  } catch (error) {
    console.error('❌ Error:', error)
  }

  // Test 3: Query all pages (no tenant filter)
  console.log('\n\n📡 Test 3: Query all pages (no tenant filter)')
  console.log('─'.repeat(50))
  
  const url3 = `${baseUrl}/api/pages?where=${encodeURIComponent(JSON.stringify({
    slug: { equals: 'home' },
  }))}&limit=10&depth=2`
  
  console.log(`URL: ${url3}\n`)
  
  try {
    const response3 = await fetch(url3)
    const data3 = await response3.json()
    
    console.log(`Status: ${response3.status}`)
    console.log(`Total docs: ${data3.docs?.length || 0}`)
    
    if (data3.docs && data3.docs.length > 0) {
      data3.docs.forEach((page: any) => {
        console.log(`\n  Page: ${page.slug}`)
        console.log(`    Tenant: ${page.tenant?.slug || page.tenant?.domain || 'unknown'}`)
        console.log(`    Has sections: ${!!page.sections}`)
      })
    } else {
      console.log('❌ No pages found')
    }
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

testAPIDirect()

