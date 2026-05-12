import { NextRequest } from 'next/server'
import { ImageResponse } from '@vercel/og'

export const runtime = 'nodejs'

let notoSansScBold: ArrayBuffer | null = null
let jetBrainsMonoBold: ArrayBuffer | null = null
let backgroundImage: string | null = null
let avatarImage: string | null = null

const loadFont = async (url: URL) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Font load failed: ${response.status}`)
  }
  return response.arrayBuffer()
}

const loadImageDataUrl = async (url: URL, mime: string) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Image load failed: ${response.status}`)
  }
  const buffer = Buffer.from(await response.arrayBuffer())
  return `data:${mime};base64,${buffer.toString('base64')}`
}

export async function GET(request: NextRequest) {
  const title = request.nextUrl.searchParams.get('title') || 'Article Title'
  const date = request.nextUrl.searchParams.get('date') || '2025.01.01'
  const tag = request.nextUrl.searchParams.get('tag') || 'DOCUMENT'
  const license = request.nextUrl.searchParams.get('license') || 'CC BY-NC-SA 4.0'

  const baseUrl = new URL(request.url)

  if (!notoSansScBold) {
    notoSansScBold = await loadFont(
      new URL('/fonts/NotoSansSC-Bold.otf', baseUrl)
    )
  }
  if (!jetBrainsMonoBold) {
    jetBrainsMonoBold = await loadFont(
      new URL('/fonts/JetBrainsMono-Bold.ttf', baseUrl)
    )
  }
  if (!backgroundImage) {
    backgroundImage = await loadImageDataUrl(
      new URL('/og/background.png', baseUrl),
      'image/png'
    )
  }
  if (!avatarImage) {
    avatarImage = await loadImageDataUrl(
      new URL('/og/avatar.png', baseUrl),
      'image/png'
    )
  }
  if (!notoSansScBold || !jetBrainsMonoBold) {
    throw new Error('Font assets are missing')
  }
  if (!backgroundImage || !avatarImage) {
    throw new Error('Image assets are missing')
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#1a1a1a',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: '"Noto Sans SC", sans-serif',
        }}
      >
        <img
          src={backgroundImage}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            top: 0,
            left: 0,
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            top: 0,
            left: 0,
          }}
        />

        <div
          style={{
            position: 'absolute',
            top: '30px',
            left: '30px',
            width: '24px',
            height: '24px',
            borderTop: '2px solid rgba(255, 255, 255, 0.4)',
            borderLeft: '2px solid rgba(255, 255, 255, 0.4)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '30px',
            right: '30px',
            width: '24px',
            height: '24px',
            borderTop: '2px solid rgba(255, 255, 255, 0.4)',
            borderRight: '2px solid rgba(255, 255, 255, 0.4)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            left: '30px',
            width: '24px',
            height: '24px',
            borderBottom: '2px solid rgba(255, 255, 255, 0.4)',
            borderLeft: '2px solid rgba(255, 255, 255, 0.4)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            right: '30px',
            width: '24px',
            height: '24px',
            borderBottom: '2px solid rgba(255, 255, 255, 0.4)',
            borderRight: '2px solid rgba(255, 255, 255, 0.4)',
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            position: 'relative',
            zIndex: 1,
            padding: '60px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '6px',
                  height: '32px',
                  backgroundColor: '#D95A2B',
                }}
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                  color: 'rgba(224, 224, 224, 0.8)',
                  fontSize: '18px',
                  fontFamily: '"JetBrains Mono", monospace',
                  fontWeight: 700,
                }}
              >
                <span>CHAPTER_POST // FIELD_REPORT</span>
                <span>SYS_DATE: {date}</span>
              </div>
            </div>
            <div
              style={{
                color: 'rgba(224, 224, 224, 0.8)',
                fontSize: '18px',
                fontFamily: '"JetBrains Mono", monospace',
                fontWeight: 700,
                marginLeft: '18px',
              }}
            >
              PROTOCOL: {license}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
          >
            <div
              style={{
                fontSize: '72px',
                fontWeight: 700,
                color: 'white',
                textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: '1.2',
              }}
            >
              {title}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                alignSelf: 'flex-start',
                backgroundColor: 'rgba(0,0,0,0.6)',
                color: 'white',
                padding: '8px 16px',
                fontSize: '18px',
                border: '1px solid white',
                borderRadius: '4px',
                fontFamily: '"JetBrains Mono", monospace',
                fontWeight: 700,
              }}
            >
              #{tag}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <img
                src={avatarImage}
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '8px',
                  objectFit: 'cover',
                }}
              />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                <div
                  style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: 'white',
                  }}
                >
                  CHONGXI
                </div>
                <div
                  style={{
                    fontSize: '16px',
                    color: 'rgba(224, 224, 224, 0.7)',
                  }}
                >
                  ● 循此苦旅 直抵群星
                </div>
              </div>
            </div>
            <div
              style={{
                fontSize: '24px',
                fontWeight: 700,
                color: '#D95A2B',
                textShadow: '0 0 20px rgba(217, 90, 43, 0.6)',
                fontFamily: '"JetBrains Mono", monospace',
              }}
            >
              xice.cx
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Noto Sans SC',
          data: notoSansScBold,
          style: 'normal',
          weight: 700,
        },
        {
          name: 'JetBrains Mono',
          data: jetBrainsMonoBold,
          style: 'normal',
          weight: 700,
        },
      ],
    }
  )
}
