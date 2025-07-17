// pages/api/query.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { openai } from '@ai-sdk/openai';
import { embed, generateText } from 'ai';
import { getIndex } from '@/lib/pinecone';
import {
  Document,
  VectorStoreIndex,
  Settings,
  BaseLLM,
  type LLMCompletionParamsStreaming,
  type LLMCompletionParamsNonStreaming,
  type CompletionResponse,
  type MessageContent,
  type LLMMetadata,
} from 'llamaindex';
import { OpenAIEmbedding } from '@llamaindex/openai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query, documentId } = req.body;
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query is required and must be a string' });
  }
  if (!documentId || typeof documentId !== 'string') {
    return res.status(400).json({ error: 'Document ID is required and must be a string' });
  }

  try {
    console.log('Query:', query);
    console.log('Received documentId:', documentId);

    // Configure LlamaIndex Settings
    Settings.llm = new (class extends BaseLLM {
      get metadata(): LLMMetadata {
        return {
          model: 'gpt-4o',
          temperature: 0.7,
          maxTokens: 1000,
          topP: 1.0,
          contextWindow: 4096,
          tokenizer: undefined,
          structuredOutput: false,
        };
      }

      async complete(params: LLMCompletionParamsStreaming): Promise<AsyncIterable<CompletionResponse>>;
      async complete(params: LLMCompletionParamsNonStreaming): Promise<CompletionResponse>;
      async complete(params: LLMCompletionParamsStreaming | LLMCompletionParamsNonStreaming): Promise<CompletionResponse | AsyncIterable<CompletionResponse>> {
        const prompt = this.extractPrompt(params.prompt);
        if ('stream' in params && params.stream) {
          throw new Error('Streaming not implemented');
        } else {
          const { text } = await generateText({
            model: openai('gpt-4o'),
            prompt,
          });
          return {
            text,
            raw: { model: 'gpt-4o', usage: { promptTokens: 0, completionTokens: 0 } },
          };
        }
      }

      async chat(): Promise<never> {
        throw new Error('Chat not implemented');
      }

      private extractPrompt(prompt: MessageContent): string {
        if (typeof prompt === 'string') {
          return prompt;
        } else if (Array.isArray(prompt)) {
          return prompt.map(detail => 'text' in detail ? detail.text : '').join(' ');
        }
        return '';
      }
    })();

    Settings.embedModel = new OpenAIEmbedding({ model: 'text-embedding-3-large' });

    // Generate embedding for the query
    const { embedding } = await embed({
      model: openai.embedding('text-embedding-3-large'),
      value: query,
    });

    // Retrieve chunks from Pinecone
    const pineconeIndex = getIndex();
    console.log('Using Pinecone namespace:', process.env.PINECONE_NAMESPACE || 'default');
    let queryResponse = await pineconeIndex.query({
      vector: embedding,
      topK: 3,
      includeMetadata: true,
      filter: { documentId: { $eq: documentId } },
    });

    console.log('Pinecone query response (documentId filter):', {
      matches: queryResponse.matches?.map(match => ({
        id: match.id,
        score: match.score,
        metadata: match.metadata,
      })) || [],
    });

    // Retry once after 2 seconds if no matches
    if (!queryResponse.matches || queryResponse.matches.length === 0) {
      console.log('No matches found, retrying after 2 seconds...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      queryResponse = await pineconeIndex.query({
        vector: embedding,
        topK: 3,
        includeMetadata: true,
        filter: { documentId: { $eq: documentId } },
      });
      console.log('Pinecone retry response (documentId filter):', {
        matches: queryResponse.matches?.map(match => ({
          id: match.id,
          score: match.score,
          metadata: match.metadata,
        })) || [],
      });
    }

    // Check if no matches found after retry
    if (!queryResponse.matches || queryResponse.matches.length === 0) {
      return res.status(404).json({
        error: `No relevant documents found for document ID: ${documentId}`,
        details: 'The document may still be processing in Pinecone. Please try querying again in a few seconds.',
      });
    }

    // Prepare documents for LlamaIndex
    const documents = queryResponse.matches.map((match) => {
      const metadata = match.metadata as { title: string; filename: string; text: string; documentId?: string };
      if (!metadata.text) {
        console.error('Missing text in metadata:', metadata);
        throw new Error('Invalid document metadata: missing text');
      }
      return new Document({
        text: metadata.text,
        metadata: { title: metadata.title, filename: metadata.filename },
      });
    });

    console.log('Documents for LlamaIndex:', documents.map(doc => ({ text: doc.text, metadata: doc.metadata })));

    // Build index and query
    const index = await VectorStoreIndex.fromDocuments(documents);
    const queryEngine = index.asQueryEngine();
    const response = await queryEngine.query({ query });

    // Format response
    const answer = response.toString();
    const sources = documents.map((doc) => ({
      title: doc.metadata.title,
      filename: doc.metadata.filename,
    }));

    res.status(200).json({
      answer,
      sources,
    });
  } catch (error) {
    console.error('Query error:', error);
    res.status(500).json({ error: 'Failed to process query', details: (error as Error).message });
  }
}