# RAG Document Retrieval

A Next.js-based **Retrieval-Augmented Generation (RAG) Knowledge Base** for enterprise and educational use. Users can upload documents (PDFs, text files, wikis) and query a custom dataset to receive precise, context-aware answers with source citations, powered by AI and scalable vector search.

# Features
- **Document Upload**: Supports PDFs and text files with text extraction.
- **RAG Pipeline**: Combines retrieval from Pinecone with AI-generated responses using Vercel AI SDK and LlamaIndex.
- **Metadata Storage**: Stores document metadata in Neon PostgreSQL with DrizzleORM.
- **Responsive UI**: Built with Tailwind CSS, featuring a chat-like query interface.
- **Advanced Features**: Real-time streaming, user authentication, analytics dashboard, and multilingual support (planned).
- **Scalable Deployment**: Hosted on Vercel with Serverless and Edge Functions.

# Tech Stack
- **Frontend**: Next.js (TypeScript, App Router)
- **AI Integration**: Vercel AI SDK (OpenAI, xAI’s Grok)
- **RAG Framework**: LlamaIndex
- **Vector Database**: Pinecone (text-embedding-3-large, 3072 dimensions, cosine metric)
- **Relational Database**: Neon PostgreSQL with DrizzleORM
- **Styling**: Tailwind CSS
- **Visualization**: Chart.js
- **Deployment**: Vercel

# Prerequisites
- Node.js 18+
- Accounts and API keys for:
  - OpenAI (for embeddings and generation)
  - Pinecone (vector storage)
  - Neon PostgreSQL (metadata storage)
  - Vercel (deployment)
  - Clerk (optional, for authentication)

# Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Gokulkiran418/rag-document-retrieval.git
   cd rag-document-retrieval
2. npm install
3. Update with your API keys
- OPENAI_API_KEY="sk-xxx"
- PINECONE_API_KEY="xxx"
- PINECONE_INDEX_NAME="index"
- POSTGRES_URL="postgresql://user:xxx@ep--endpoint.us-east-1.aws.neon.tech/db?sslmode=require"
- POSTGRES_PRISMA_URL="postgresql://user:xxx@ep--endpoint.us-east-1.aws.neon.tech/db?pgbouncer=true&sslmode=require"
- POSTGRES_URL_NON_POOLING="postgresql://user:xxx@ep--endpoint.us-east-1.aws.neon.tech/db?sslmode=require"
4. npm run dev

# Development
- Document Upload: API route at /api/upload handles file processing.
- RAG Queries: API route at /api/query processes user queries with RAG.
- Database: Run migrations with npx drizzle-kit push to set up the documents table.
- Pinecone: Ensure the rag-index index is created with 3072 dimensions and cosine metric.

# Deployment
- Push to GitHub.
- Connect to Vercel via the dashboard.
- Add environment variables in Vercel’s Settings.

# Acknoledgements
- Vercel AI SDK
- Pinecone
- Neon PostgreSQL
- LlamaIndex