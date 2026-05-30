import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#18181b',
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '3px',
        }}
      >
        <span
          style={{
            color: '#ffffff',
            fontSize: '21px',
            fontWeight: '800',
            fontFamily: 'monospace',
            lineHeight: 1,
          }}
        >
          n
        </span>
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#ec4899',
            marginTop: '9px',
            flexShrink: 0,
          }}
        />
      </div>
    ),
    size,
  )
}
