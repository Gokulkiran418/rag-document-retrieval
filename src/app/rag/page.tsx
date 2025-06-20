"use client";

import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "../../context/ThemeContext";

type Tween = gsap.core.Tween;
gsap.registerPlugin(ScrollTrigger);

// Cost-control constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_QUERIES_PER_DAY = 5;

export default function RagPage() {
  const { gradientColors } = useTheme();

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [query, setQuery] = useState("");
  const [uploadResponse, setUploadResponse] = useState<{
    message: string;
    documentId: string;
    chunkCount: number;
    filename: string;
  } | null>(null);
  const [queryResponse, setQueryResponse] = useState<{
    answer: string;
    sources: { title: string; filename: string }[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isQuerying, setIsQuerying] = useState(false);

  // daily query count
  const [dailyQueryCount, setDailyQueryCount] = useState(0);

  // Load daily query count from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("rag-query-count");
    if (saved) {
      try {
        const { date, count } = JSON.parse(saved);
        const today = new Date().toDateString();
        if (date === today) {
          setDailyQueryCount(count);
        } else {
          localStorage.removeItem("rag-query-count");
        }
      } catch {}
    }
  }, []);

  // Save daily count whenever it changes
  useEffect(() => {
    const today = new Date().toDateString();
    localStorage.setItem(
      "rag-query-count",
      JSON.stringify({ date: today, count: dailyQueryCount })
    );
  }, [dailyQueryCount]);

  const bgRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const spinnerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<Tween | null>(null);

  useEffect(() => {
    if (!bgRef.current) return;
    tweenRef.current?.kill();

    bgRef.current.style.background = `linear-gradient(135deg, ${gradientColors.join(
      ", "
    )})`;
    bgRef.current.style.backgroundSize = "200% 200%";
    bgRef.current.style.backgroundPosition = "0% 0%";

    tweenRef.current = gsap.to(bgRef.current, {
      backgroundPosition: "200% 200%",
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      overwrite: "auto",
    });

    return () => {
      tweenRef.current?.kill();
      tweenRef.current = null;
    };
  }, [gradientColors]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (cardRef.current) {
        gsap.fromTo(
          cardRef.current.children,
          { opacity: 0, x: -50 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            stagger: 0.3,
            ease: "power2.out",
            scrollTrigger: {
              trigger: cardRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }
      ScrollTrigger.refresh();
    }, cardRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if ((isUploading || isQuerying) && spinnerRef.current) {
      gsap.to(spinnerRef.current, {
        rotation: 360,
        duration: 1,
        repeat: -1,
        ease: "linear",
      });
    } else if (spinnerRef.current) {
      gsap.killTweensOf(spinnerRef.current);
      gsap.set(spinnerRef.current, { rotation: 0 });
    }
  }, [isUploading, isQuerying]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("File too large! Max size is 5 MB.");
      return;
    }
    setError(null);
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        setUploadResponse(data);
        setFile(null);
        setTitle("");
        gsap.to(progressBarRef.current, {
          width: "100%",
          duration: 1,
          ease: "power2.out",
          onComplete: () => {
            gsap.to(progressBarRef.current!, { width: 0, duration: 0.3 });
          },
        });
      } else {
        setError(data.error || "Upload failed");
      }
    } catch {
      setError("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) {
      setError("Please enter a query");
      return;
    }
    if (dailyQueryCount >= MAX_QUERIES_PER_DAY) {
      setError(
        `Daily query limit reached (${MAX_QUERIES_PER_DAY}). Try again tomorrow.`
      );
      return;
    }
    setError(null);
    setIsQuerying(true);

    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (res.ok) {
        setQueryResponse(data);
        setQuery("");
        setDailyQueryCount((c) => c + 1);
        const section = document.querySelector(".response-section");
        if (section) {
          gsap.fromTo(
            section,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
          );
        }
      } else {
        setError(data.error || "Query failed");
      }
    } catch {
      setError("Query failed");
    } finally {
      setIsQuerying(false);
    }
  };

  return (
    <div className="relative p-6 lg:p-8 min-h-screen overflow-hidden">
      <div
        ref={bgRef}
        className="absolute inset-0 rounded-lg"
        style={{ zIndex: -1 }}
      />

      <div ref={cardRef} className="relative z-10 max-w-6xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold dark:text-white text-center">
          RAG Knowledge Base
        </h1>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 italic">
        (Yes, this is for my portfolio to land a job 😄 — everything’s limited because I’m using free-tier tech. Use it wisely!)
      </p>

        {/* Upload + Query Side-by-Side Container */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Upload Section */}
          <section className="flex-1 p-6 rounded-lg shadow-md bg-cardcolor-light/10 dark:bg-cardcolor-dark/10 space-y-4 text-text-light dark:text-text-dark">

            <h2 className="text-xl font-semibold">Upload Document</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Max file size: {Math.floor(MAX_FILE_SIZE / (1024 * 1024))} MB
            </p>
            <form onSubmit={handleUpload} className="space-y-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Document Title"
                className="w-full p-2 border rounded-md bg-white text-black dark:bg-zinc-800 dark:text-white dark:border-zinc-700"
              />
              <input
                type="file"
                accept=".pdf,.txt"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full p-2 border rounded-md"
              />
              <div ref={progressBarRef} className="h-2 bg-green-500 w-0 rounded" />
              <button
                type="submit"
                disabled={isUploading}
                className="w-full p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:bg-gray-400 dark:bg-blue-700 dark:hover:bg-blue-800"
              >
                {isUploading ? "Uploading..." : "Upload"}
              </button>

              {isUploading && (
                <div className="flex justify-center mt-4">
                  <div
                    className="w-8 h-8 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"
                  />
                </div>
              )}
            </form>

            {uploadResponse && (
              <div className="mt-4 p-4 bg-green-100 border border-green-500 rounded-md text-black">
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
          <section className="flex-1 p-6 rounded-lg shadow-md bg-cardcolor-light/10 dark:bg-cardcolor-dark/10 space-y-4 text-text-light dark:text-text-dark">
            <h2 className="text-xl font-semibold">Ask a Question</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Daily queries allowed: {MAX_QUERIES_PER_DAY}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {MAX_QUERIES_PER_DAY - dailyQueryCount} queries left today
              </p>
            <form onSubmit={handleQuery} className="space-y-4">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., What is the summary?"
                className="w-full p-2 border rounded-md bg-white text-black dark:bg-zinc-800 dark:text-white dark:border-zinc-700"
              />
              <button
                type="submit"
                disabled={isQuerying}
                className="w-full p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:bg-gray-400 dark:bg-blue-700 dark:hover:bg-blue-800"
              >
                {isQuerying ? "Querying..." : "Query"}
              </button>

              {isQuerying && (
                <div className="flex justify-center mt-4">
                  <div className="w-8 h-8 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin" />
                </div>
              )}
            </form>

            {queryResponse && (
              <div className="response-section mt-4 p-4 bg-green-100 border border-green-500 rounded-md text-black">
                <h3 className="text-lg font-semibold">Answer</h3>
                <p>{queryResponse.answer}</p>
                <h3 className="text-lg font-semibold mt-4">Sources</h3>
                <ul className="list-disc pl-5 mt-2">
                  {queryResponse.sources.map((s, i) => (
                    <li key={i}>
                      {s.title} ({s.filename})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </div>

        {error && (
          <div className="p-4 bg-red-100 border border-red-500 rounded-md">
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
