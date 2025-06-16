// src/app/page.tsx
'use client';

import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  const [uploadResponse, setUploadResponse] = useState<{ message: string; documentId: string; chunkCount: number; filename: string } | null>(null);
  const [queryResponse, setQueryResponse] = useState<{ answer: string; sources: { title: string; filename: string }[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isQuerying, setIsQuerying] = useState<boolean>(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    setIsUploading(true);
    setError(null);

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
        setUploadResponse(data);
        setFile(null);
        setTitle('');
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch (err) {
      setError('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) {
      setError('Please enter a query');
      return;
    }

    setIsQuerying(true);
    setError(null);

    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (res.ok) {
        setQueryResponse(data);
        setQuery('');
      } else {
        setError(data.error || 'Query failed');
      }
    } catch (err) {
      setError('Query failed');
    } finally {
      setIsQuerying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-primary">RAG Knowledge Base</h1>
        <p className="text-secondary mt-2">Upload documents and query your knowledge base with AI-powered insights.</p>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-3xl space-y-8">
        {/* Upload Section */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Upload Document</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Document Title"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="file"
              accept=".pdf,.txt"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <button
              type="submit"
              disabled={isUploading}
              className={`w-full bg-primary text-white p-2 rounded-md hover:bg-blue-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed`}
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
          </form>
          {uploadResponse && (
            <div className="mt-4 p-4 bg-success/10 border border-success rounded-md">
              <p className="text-success">
                Uploaded: {uploadResponse.filename}<br />
                Document ID: {uploadResponse.documentId}<br />
                Chunks: {uploadResponse.chunkCount}
              </p>
            </div>
          )}
        </section>

        {/* Query Section */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Ask a Question</h2>
          <form onSubmit={handleQuery} className="space-y-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., What are AcmeTech’s products?"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={isQuerying}
              className={`w-full bg-primary text-white p-2 rounded-md hover:bg-blue-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed`}
            >
              {isQuerying ? 'Querying...' : 'Query'}
            </button>
          </form>
          {queryResponse && (
            <div className="mt-4 p-4 bg-success/10 border border-success rounded-md">
              <h3 className="text-lg font-semibold text-success">Answer</h3>
              <p className="mt-2">{queryResponse.answer}</p>
              <h3 className="text-lg font-semibold mt-4 text-success">Sources</h3>
              <ul className="list-disc pl-5 mt-2">
                {queryResponse.sources.map((source, i) => (
                  <li key={i} className="text-secondary">
                    {source.title} ({source.filename})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-error/10 border border-error rounded-md">
            <p className="text-error">{error}</p>
          </div>
        )}
      </main>
    </div>
  );
}