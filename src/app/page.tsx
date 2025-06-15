// src/app/page.tsx
'use client';

import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setResponse(`Uploaded: ${data.filename}\nText: ${data.text.slice(0, 100)}...`);
        setError(null);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Upload failed');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">RAG Knowledge Base</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          accept=".pdf,.txt"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="border p-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Upload
        </button>
      </form>
      {response && <pre className="mt-4 text-sm">{response}</pre>}
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </main>
  );
}