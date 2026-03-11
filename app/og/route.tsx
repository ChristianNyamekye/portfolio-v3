import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          backgroundColor: '#f7f5f2',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Blue accent bar left */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 6,
            backgroundColor: '#2563eb',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '72px 80px 60px 80px',
            width: '100%',
          }}
        >
          {/* Top section */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 48,
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: '#2563eb',
                }}
              />
              <span style={{ fontSize: 14, color: '#8a8a8a', letterSpacing: '0.15em', textTransform: 'uppercase' as const }}>
                Portfolio
              </span>
            </div>

            <div
              style={{
                fontSize: 72,
                fontWeight: 700,
                color: '#1a1a1a',
                letterSpacing: '-0.04em',
                lineHeight: 1,
                marginBottom: 24,
              }}
            >
              Christian Nyamekye
            </div>

            <div
              style={{
                fontSize: 24,
                color: '#2563eb',
                fontWeight: 500,
                marginBottom: 20,
              }}
            >
              Engineer & Builder
            </div>

            <div style={{ fontSize: 16, color: '#6b6560', lineHeight: 1.6, maxWidth: 550 }}>
              Building at the intersection of hardware, software, and applied AI — from embedded systems to robotics platforms.
            </div>
          </div>

          {/* Bottom */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid #dbd8d3',
              paddingTop: 20,
            }}
          >
            <span style={{ fontSize: 13, color: '#aaa' }}>christiannyamekye.com</span>
            <div style={{ display: 'flex', gap: 24 }}>
              <span style={{ fontSize: 13, color: '#8a8a8a' }}>Dartmouth '26</span>
              <span style={{ fontSize: 13, color: '#8a8a8a' }}>EE + CS</span>
            </div>
          </div>
        </div>

        {/* Subtle geometric accent — right side */}
        <div
          style={{
            position: 'absolute',
            right: -40,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 280,
            height: 280,
            border: '1px solid #e0ddd8',
            borderRadius: '50%',
            opacity: 0.5,
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: -10,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 200,
            height: 200,
            border: '1px solid #dbd8d3',
            borderRadius: '50%',
            opacity: 0.3,
          }}
        />
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
