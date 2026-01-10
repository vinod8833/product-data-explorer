'use client';

import { SWRConfig } from 'swr';
import { api } from '@/lib/api';

const fetcher = (url: string) => {
  console.log('SWR Fetcher called with URL:', url);
  return api.get(url).then(res => {
    console.log('SWR Fetcher success:', res.data);
    return res.data;
  }).catch(err => {
    console.error('SWR Fetcher error:', err);
    console.error('Error details:', {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data,
      config: err.config
    });
    throw err;
  });
};

export default function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher,
        onError: (error, key) => {
          console.error('SWR Error:', error, 'Key:', key);
        },
        shouldRetryOnError: false,
        revalidateOnFocus: false,
        dedupingInterval: 2000,
      }}
    >
      {children}
    </SWRConfig>
  );
}