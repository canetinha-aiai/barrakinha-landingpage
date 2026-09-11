import React from 'react';
import ReactDOM from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import { Toaster } from '@/components/ui/toaster';
import '@/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <PrivacyPolicy />
    <Toaster />
    <Analytics />
  </>,
);
