'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export default function APITester() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    testAPI();
  }, []);

  const testAPI = async () => {
    try {
      setStatus('loading');
      console.log('Testing API connection...');
      
      const response = await api.get('/products?limit=3');
      console.log('API Response:', response.data);
      
      setData(response.data);
      setStatus('success');
    } catch (err: any) {
      console.error('API Test Error:', err);
      setError(err.message || 'Unknown error');
      setStatus('error');
    }
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

}