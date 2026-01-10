'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function TestApiPage() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const testApi = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('Testing API connection...');
      console.log('API Base URL:', api.defaults.baseURL);
      
      const response = await api.get('/products');
      console.log('API Response:', response);
      setResult(response.data);
    } catch (err: any) {
      console.error('API Error:', err);
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testApi();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">API Connection Test</h1>
      
      <div className="mb-4">
        <p><strong>API Base URL:</strong> {api.defaults.baseURL}</p>
        <p><strong>Status:</strong> {loading ? 'Loading...' : error ? 'Error' : 'Success'}</p>
      </div>

      <button 
        onClick={testApi}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        disabled={loading}
      >
        Test API Again
      </button>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <strong>Success!</strong> Found {result.total} products
          <div className="mt-4">
            <h3 className="font-bold">First Product:</h3>
            <pre className="text-sm overflow-auto bg-white p-2 rounded">
              {JSON.stringify(result.data[0], null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}