'use client';

import { useState } from 'react';
import { SpeechSynthesisProvider } from '@/components/SpeechSynthesisProvider';
import TTSComparison from '@/components/TTSComparison';

export default function Home() {
  return (
    <SpeechSynthesisProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Text-to-Speech Technology
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the evolution of voice technology with our interactive demonstration
            </p>
          </header>

          <main>
            <TTSComparison />
          </main>
        </div>
      </div>
    </SpeechSynthesisProvider>
  );
}