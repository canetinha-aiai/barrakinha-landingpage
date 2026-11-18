import React, { useEffect, useState } from 'react';
import { ImageOff } from 'lucide-react';

export function ProductPhoto({ src, dim = false, fallbackSize = 22 }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (src && !failed) {
    return (
      <img
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: dim ? 0.45 : 1 }}
      />
    );
  }

  return <ImageOff size={fallbackSize} color="#8A7E75" style={{ opacity: dim ? 0.5 : 1 }} />;
}
