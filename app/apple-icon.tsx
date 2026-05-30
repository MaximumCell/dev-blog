import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#18181b',
          width: '180px',
          height: '180px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
        }}
      >
        <span
          style={{
            color: '#ffffff',
            fontSize: '110px',
            fontWeight: '800',
            fontFamily: 'monospace',
            lineHeight: 1,
          }}
        >
          n
        </span>
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: '#ec4899',
            marginTop: '50px',
            flexShrink: 0,
          }}
        />
      </div>
    ),
    size,
  )
}
