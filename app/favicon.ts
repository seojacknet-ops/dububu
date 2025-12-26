import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 88,
          background: 'linear-gradient(135deg, #ffe8f0 0%, #fff5e6 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '23.5%',
        }}
      >
        🐻🐼
      </div>
    ),
    {
      width: 32,
      height: 32,
      emoji: 'noto',
    }
  );
}
