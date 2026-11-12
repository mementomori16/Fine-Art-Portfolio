'use client';

import VideoPage from '../../src/components/VideoPage/VideoPage';
import '../../src/components/VideoPage/videoPage.scss';

export default function Page() {
  return (
    <main style={{ background: '#0b0f12', minHeight: '100vh', width: '100%' }}>
      <VideoPage isStandalone={true} />
    </main>
  );
}