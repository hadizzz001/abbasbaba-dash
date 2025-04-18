// app/generate-code/page.tsx
'use client';

import { useState } from 'react';

export default function GenerateCodePage() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerateCode = async () => {
    setLoading(true);
    setResult('');

    // 👇 Replace this with the actual ID of the record in your DB
    const id = '68023f1155355b32519511b3';

    try {
      const res = await fetch(`/api/code?id=${id}`, {
        method: 'PATCH',
      });

      const data = await res.json();

      if (res.ok) {
        setResult(`${data.updatedCategory.code.slice(-1)[0]}`);
      } else {
        setResult(`❌ Error: ${data.error}`);
      }
    } catch (err) {
      setResult('❌ Failed to call API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <button
        onClick={handleGenerateCode}
        disabled={loading}
        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
      >
        {loading ? 'Generating...' : 'Generate New Code'}
      </button>

      {result && (
        <p className="mt-4 text-lg text-gray-800">{result}</p>
      )}
    </div>
  );
}
