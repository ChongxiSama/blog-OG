import { NextRequest, NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

const decodeHtmlEntities = (value: string) =>
  value
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')

const extractFirstString = (value: unknown): string | null => {
  if (typeof value === 'string') return value
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = extractFirstString(item)
      if (found) return found
    }
  }
  if (value && typeof value === 'object') {
    for (const item of Object.values(value)) {
      const found = extractFirstString(item)
      if (found) return found
    }
  }
  return null
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')

  if (!url) {
    return NextResponse.json(
      { error: 'URL parameter is required' },
      { status: 400 }
    )
  }

  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(10000) })
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`)
    }
    const html = await response.text()
    const $ = cheerio.load(html)

    let title = ''
    const ogTitle = $('meta[property="og:title"]').attr('content') || ''
    if (ogTitle) {
      title = ogTitle.replace(' - Chongxiの咖啡屋', '').trim()
    }

    let date = ''
    $('p').each((_, elem) => {
      const text = $(elem).text()
      const match = text.match(/Released:\s*(\d{4}\.\d{2}\.\d{2})/)
      if (match) {
        date = match[1]
      }
    })

    let license = 'CC BY-NC-SA 4.0'
    $('*').each((_, elem) => {
      const text = $(elem).text()
      if (text.includes('Protocol_Ref:')) {
        const match = text.match(/Protocol_Ref:\s*([\w-\.]+)/)
        if (match) {
          license = match[1]
        }
      }
    })

    let tag = 'DOCUMENT'
    $('astro-island[component-export="CopyrightCard"]').each((_, elem) => {
      const propsStr = $(elem).attr('props')
      if (!propsStr) return
      try {
        const decoded = decodeHtmlEntities(propsStr)
        const propsObj = JSON.parse(decoded) as { tags?: unknown } | unknown[]
        const tagsValue = Array.isArray(propsObj)
          ? propsObj
          : (propsObj as { tags?: unknown }).tags
        const foundTag = extractFirstString(tagsValue)
        if (foundTag) {
          tag = foundTag
        }
      } catch (e) {
        console.warn('Failed to parse tags:', e)
      }
    })

    return NextResponse.json({ title, date, license, tag })
  } catch (error) {
    console.error('Scraping error:', error)
    return NextResponse.json(
      { error: 'Failed to scrape the URL' },
      { status: 500 }
    )
  }
}
