'use client'

import React, { useState } from 'react';
import { useAction, } from "convex/react";
import { api } from '../../../../../convex/_generated/api';


const ChatWithContextComponent: React.FC = () => {
    const [query, setQuery] = useState<string>('');
    const [response, setResponse] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const chatWithContext = useAction(api.embeddings.chatWithContext);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const result = await chatWithContext({ query });
            setResponse(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Chat with Context</h1>
            <form onSubmit={handleSubmit} className="mb-4">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter your question..."
                    className="w-full p-2 border rounded"
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
                >
                    {isLoading ? 'Loading...' : 'Submit'}
                </button>
            </form>
            {error && (
                <div className="text-red-500 mb-4">{error}</div>
            )}
            {response && (
                <div className="bg-gray-100 p-4 rounded">
                    <h2 className="font-bold mb-2">Response:</h2>
                    <p>{response}</p>
                </div>
            )}
        </div>
    );
};

export default ChatWithContextComponent;