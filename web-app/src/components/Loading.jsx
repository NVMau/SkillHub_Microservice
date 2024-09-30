import { Player } from '@lottiefiles/react-lottie-player';
import React from 'react';

const Loading = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Player
        autoplay
        loop
        src="/json-loading/loading.json" // Đây là link JSON animation từ LottieFiles hoặc tệp JSON bạn đã tải về
        style={{ height: '300px', width: '300px' }}
      />
    </div>
  );
};

export default Loading;
