'use client';

import useSWR from 'swr';
import { api } from '@/lib/api';

const fetcher = (url: string) => {
  console.log('Simple SWR Fetcher called with URL:', url);
  return api.get(url).then(res => {
    console.log('Simple SWR Fetcher success:', res.data);
    return res.data;
  }).catch(err => {
    console.error('Simple SWR Fetcher error:', err);
    throw err;
  });
};

export default function TestSWRPage() {
  const { data, error, isLoading } = useSWR('/products', fetcher);

  console.log('SWR State:', { data, error, isLoading });

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">SWR Test</h1>
      
      <div className="mb-4">
        <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
        <p><strong>Error:</strong> {error ? error.message : 'None'}</p>
        <p><strong>Data:</strong> {data ? `${data.total} products` : 'None'}</p>
      </div>

      {isLoading && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
          Loading products...
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error.message}
        </div>
      )}

      {data && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <strong>Success!</strong> Found {data.total} products
          <div className="mt-4">
            <h3 className="font-bold">First Product:</h3>
            <pre className="text-sm overflow-auto bg-white p-2 rounded">
              {JSON.stringify(data.data[0], null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}