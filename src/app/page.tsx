'use client';

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  const [uploadResponse, setUploadResponse] = useState<{ message: string; documentId: string; chunkCount: number; filename: string } | null>(null);
  const [queryResponse, setQueryResponse] = useState<{ answer: string; sources: { title: string; filename: string }[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isQuerying, setIsQuerying] = useState<boolean>(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const responseSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial animations
    gsap.from('.header', { opacity: 0, y: -50, duration: 1, ease: 'power2.out' });
    gsap.from('.upload-section', { opacity: 0, x: -100, duration: 1, delay: 0.5, ease: 'power2.out' });
    gsap.from('.query-section', { opacity: 0, x: 100, duration: 1, delay: 0.5, ease: 'power2.out' });

    // Animated background
    gsap.to('.background', {
      backgroundPosition: '200% 200%',
      duration: 15,
      repeat: -3,
      yoyo: true,
      ease: 'linear',
    });

    // Responsiveness with matchMedia
    const mm = gsap.matchMedia();
    mm.add('(max-width: 768px)', () => {
      gsap.from('.upload-section, .query-section', { opacity: 0, y: 50, duration: 0.8, stagger: 0.2 });
    });

    return () => mm.revert();
  }, []);

  useEffect(() => {
    if (queryResponse && responseSectionRef.current) {
      gsap.fromTo(responseSectionRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' });
    }
  }, [queryResponse]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    gsap.to('body', {
      color: newTheme === 'light' ? '#000' : '#fff',
      duration: 0.5,
      ease: 'power2.inOut',
    });
  };

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
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok) {
        setUploadResponse(data);
        setFile(null);
        setTitle('');
        gsap.to('.progress-bar', {
          width: '100%',
          duration: 1,
          ease: 'power2.out',
          onComplete: () => {
            gsap.to('.progress-bar', { width: 0, duration: 0.3, ease: 'power2.in' });
          },
        });
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
    <div className={`min-h-screen flex flex-col items-center p-4 sm:p-6 lg:p-8 ${theme}`}>
      {/* Animated Background */}
      <div className="background fixed inset-0 z-[-1]" />

      {/* Header */}
      <header className="header text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold">RAG Knowledge Base</h1>
        <p className="mt-2 text-lg">Upload documents and query your knowledge base with AI-powered insights.</p>
        <button
          onClick={toggleTheme}
          className="mt-4 p-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white rounded-md hover:scale-105 transition-transform"
        >
          Toggle {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-3xl space-y-8">
        {/* Upload Section */}
        <section className="upload-section bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Upload Document</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Document Title"
              className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white hover:opacity-80 transition-opacity"
            />
            <input
              type="file"
              accept=".pdf,.txt"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white hover:opacity-80 transition-opacity"
            />
            <div className="progress-bar h-2 bg-blue-500 w-0 rounded"></div>
            <button
              type="submit"
              disabled={isUploading}
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:scale-105 transition-transform disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
          </form>
          {uploadResponse && (
            <div className="mt-4 p-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 rounded-md">
              <p>
                Uploaded: {uploadResponse.filename}<br />
                Document ID: {uploadResponse.documentId}<br />
                Chunks: {uploadResponse.chunkCount}
              </p>
            </div>
          )}
        </section>

        {/* Query Section */}
        <section className="query-section bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Ask a Question</h2>
          <form onSubmit={handleQuery} className="space-y-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., What are AcmeTech’s products?"
              className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white hover:opacity-80 transition-opacity"
            />
            <button
              type="submit"
              disabled={isQuerying}
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:scale-105 transition-transform disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isQuerying ? 'Querying...' : 'Query'}
            </button>
          </form>
          {queryResponse && (
            <div ref={responseSectionRef} className="response-section mt-4 p-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 rounded-md">
              <h3 className="text-lg font-semibold">Answer</h3>
              <p className="mt-2">{queryResponse.answer}</p>
              <h3 className="text-lg font-semibold mt-4">Sources</h3>
              <ul className="list-disc pl-5 mt-2">
                {queryResponse.sources.map((source, i) => (
                  <li key={i}>
                    {source.title} ({source.filename})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 rounded-md">
            <p>{error}</p>
          </div>
        )}
      </main>
    </div>
  );
}