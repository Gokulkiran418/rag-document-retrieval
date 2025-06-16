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
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.from('.header', { opacity: 0, y: -50, duration: 1, ease: 'power2.out' });
    gsap.from('.upload-section', { opacity: 0, x: -100, duration: 1, ease: 'power2.out' });
    gsap.from('.query-section', { opacity: 0, x: 100, duration: 1, ease: 'power2.out' });

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

  useEffect(() => {
    const backgroundClass = theme === 'light' ? 'bg-light-gradient' : 'bg-dark-gradient';
    if (backgroundRef.current) {
      backgroundRef.current.className = `background fixed inset-0 z-[-1] ${backgroundClass}`;
    }

    const ctx = gsap.context(() => {
      gsap.killTweensOf('.background');
      gsap.to('.background', {
        backgroundPosition: '200% 200%',
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'linear',
        immediateRender: true,
      });
    });

    return () => ctx.revert();
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
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
      {/* Background */}
      <div ref={backgroundRef} className={`background fixed inset-0 z-[-1] ${theme === 'light' ? 'bg-light-gradient' : 'bg-dark-gradient'}`} />

      {/* Header */}
      <header className="header text-center mb-8">
        <h1 className={`text-3xl sm:text-4xl font-bold ${theme === 'light' ? 'text-black' : 'text-white'}`}>RAG Knowledge Base</h1>
        <p className={`mt-2 text-lg ${theme === 'light' ? 'text-black' : 'text-white'}`}>
          Upload documents and query your knowledge base with AI-powered insights.
        </p>
        <button
          onClick={toggleTheme}
          className={`mt-4 p-2 bg-gray-200 ${theme === 'light' ? 'bg-primary text-white' : 'bg-black-900 text-white'} rounded-md hover:scale-105 transition-transform`}
        >
          Toggle {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-3xl space-y-8">
        {/* Upload Section */}
        <section className={`upload-section p-6 rounded-lg shadow-md ${theme === 'light' ? 'bg-blue-100' : 'bg-black-900'}`}>
          <h2 className={`text-xl font-semibold mb-4 ${theme === 'light' ? 'text-dark' : 'text-white'}`}>Upload Document</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Document Title"
              className={`w-full p-2 border rounded-md ${theme === 'light' ? 'border-gray-300 bg-white text-black' : 'border-gray-600 bg-black text-white'}`}
            />
            <input
              type="file"
              accept=".pdf,.txt"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className={`w-full p-2 border rounded-md ${theme === 'light' ? 'border-gray-300 bg-white text-black' : 'border-gray-600 bg-black text-white'}`}
            />
            <div className="progress-bar h-2 bg-blue-500 w-0 rounded"></div>
            <button
              type="submit"
              disabled={isUploading}
              className={`w-full p-2 rounded-md text-white ${theme === 'light' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-error hover:bg-error-dark'} disabled:bg-gray-400 disabled:cursor-not-allowed`}
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
          </form>
          {uploadResponse && (
            <div className={`mt-4 p-4 border rounded-md ${theme === 'light' ? 'bg-green-100 border-green-400' : 'bg-green-900 border-green-600 text-white'}`}>
              <p>
                Uploaded: {uploadResponse.filename}
                <br />
                Document ID: {uploadResponse.documentId}
                <br />
                Chunks: {uploadResponse.chunkCount}
              </p>
            </div>
          )}
        </section>

        {/* Query Section */}
        <section className={`query-section p-6 rounded-lg shadow-md ${theme === 'light' ? 'bg-blue-100' : 'bg-black-900'}`}>
          <h2 className={`text-xl font-semibold mb-4 ${theme === 'light' ? 'text-dark' : 'text-white'}`}>Ask a Question</h2>
          <form onSubmit={handleQuery} className="space-y-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., What is the summary?"
              className={`w-full p-2 border rounded-md ${theme === 'light' ? 'border-gray-300 bg-white text-black' : 'border-gray-600 bg-black text-white'}`}
            />
            <button
              type="submit"
              disabled={isQuerying}
              className={`w-full p-2 rounded-md text-white ${theme === 'light' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-error hover:bg-error-dark'} disabled:bg-gray-400 disabled:cursor-not-allowed`}
            >
              {isQuerying ? 'Querying...' : 'Query'}
            </button>
          </form>
          {queryResponse && (
            <div
              ref={responseSectionRef}
              className={`response-section mt-4 p-4 border rounded-md ${theme === 'light' ? 'bg-green-100 border-green-400' : 'bg-green-900 border-green-600 text-white'}`}
            >
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
          <div className={`p-4 border rounded-md ${theme === 'light' ? 'bg-red-100 border-red-400' : 'bg-red-900 border-red-600'}`}>
            <p>{error}</p>
          </div>
        )}
      </main>
    </div>
  );
}