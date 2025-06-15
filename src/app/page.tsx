// src/app/page.tsx
'use client';

import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  const [uploadResponse, setUploadResponse] = useState<string | null>(null);
  const [queryResponse, setQueryResponse] = useState<{ answer: string; sources: any[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setUploadResponse(
          `Uploaded: ${data.filename}\nDocument ID: ${data.documentId}\nChunks: ${data.chunkCount}`
        );
        setError(null);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Upload failed');
    }
  };

  const handleQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) {
      setError('Please enter a query');
      return;
    }

    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (res.ok) {
        setQueryResponse(data);
        setError(null);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Query failed');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">RAG Knowledge Base</h1>
      <div className="flex flex-col gap-8 w-full max-w-md">
        {/* Upload Form */}
        <form onSubmit={handleUpload} className="flex flex-col gap-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Document Title"
            className="border p-2"
          />
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
        {uploadResponse && <pre className="mt-4 text-sm">{uploadResponse}</pre>}

        {/* Query Form */}
        <form onSubmit={handleQuery} className="flex flex-col gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question"
            className="border p-2"
          />
          <button type="submit" className="bg-green-500 text-white p-2 rounded">
            Query
          </button>
        </form>
        {queryResponse && (
          <div className="mt-4 text-sm">
            <p><strong>Answer:</strong> {queryResponse.answer}</p>
            <p><strong>Sources:</strong></p>
            <ul>
              {queryResponse.sources.map((source, i) => (
                <li key={i}>
                  {source.title} ({source.filename})
                </li>
              ))}
            </ul>
          </div>
        )}
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>
    </main>
  );
}