'use client';

import { useState, useEffect } from 'react';
import { useSpeech } from './SpeechSynthesisProvider';

export default function TTSComparison() {
  const {
    isWebSpeechPlaying,
    isAzurePlaying,
    webSpeechError,
    azureError,
    playWebSpeech,
    stopWebSpeech,
    playAzureSpeech,
    stopAzureSpeech
  } = useSpeech();

  const [hasWebSpeech, setHasWebSpeech] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      setHasWebSpeech(true);
    }
  }, []);

  const articleText = `The accounting profession is undergoing a dramatic transformation in 2024, driven by technological advancement, regulatory changes, and evolving business needs. Artificial intelligence and automation are revolutionizing traditional accounting practices, enabling professionals to focus on strategic advisory roles rather than routine tasks.

Cloud-based accounting platforms have become the standard, offering real-time financial data access, enhanced collaboration capabilities, and improved security measures. These systems integrate seamlessly with other business tools, providing comprehensive insights into financial performance and enabling data-driven decision-making.

Sustainability accounting and Environmental, Social, and Governance (ESG) reporting have moved from niche considerations to mainstream requirements. Investors, regulators, and stakeholders increasingly demand transparent reporting on environmental impact, social responsibility, and governance practices. Accountants are now at the forefront of measuring, monitoring, and reporting on these critical metrics.

Cryptocurrency and digital assets present new challenges and opportunities for the accounting profession. The rise of Bitcoin, Ethereum, and other digital currencies has created the need for new accounting standards, valuation methodologies, and regulatory frameworks. Forward-thinking firms are developing expertise in blockchain technology and digital asset management.

Remote work has fundamentally changed accounting operations, with firms adopting hybrid models and digital collaboration tools. This shift has accelerated the adoption of cloud technologies, automated workflows, and virtual client service models. The traditional accounting office is evolving into a more flexible, technology-enabled workspace.

Cybersecurity has become a top priority for accounting firms, as financial data becomes increasingly valuable to cybercriminals. Accountants must now be vigilant about protecting sensitive client information, implementing robust security protocols, and staying ahead of emerging threats in the digital landscape.

The role of accountants is expanding beyond traditional financial reporting to include business advisory services, technology consulting, and strategic planning. This evolution requires professionals to develop new skills in data analytics, business intelligence, and digital transformation, positioning them as trusted advisors to their clients and organizations.`;

  const handleWebSpeechToggle = () => {
    if (isWebSpeechPlaying) {
      stopWebSpeech();
    } else {
      playWebSpeech(articleText);
    }
  };

  const handleAzureSpeechToggle = () => {
    if (isAzurePlaying) {
      stopAzureSpeech();
    } else {
      const subscriptionKey = process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY || '';
      const region = process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION || 'eastus';
      playAzureSpeech(articleText, subscriptionKey, region);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          The Evolution of Accounting in 2024
        </h2>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-10">
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              {articleText.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-justify">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="sticky top-8 space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 text-center lg:text-left mb-4">
                Listen to Article
              </h3>

              <button
                onClick={handleWebSpeechToggle}
                disabled={!hasWebSpeech}
                className={`w-full flex items-center gap-3 font-semibold py-4 px-6 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none ${
                  isWebSpeechPlaying
                    ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isWebSpeechPlaying ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  )}
                </svg>
                <div className="text-left min-w-0">
                  <div className="font-medium">
                    {isWebSpeechPlaying ? 'Stop Speaking' : 'Web Speech'}
                  </div>
                  <div className="text-xs opacity-90">
                    {isWebSpeechPlaying ? 'Click to stop' : 'Browser • Free'}
                  </div>
                </div>
              </button>

              <button
                onClick={handleAzureSpeechToggle}
                className={`w-full flex items-center gap-3 font-semibold py-4 px-6 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none ${
                  isAzurePlaying
                    ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isAzurePlaying ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  )}
                </svg>
                <div className="text-left min-w-0">
                  <div className="font-medium">
                    {isAzurePlaying ? 'Stop Speaking' : 'Azure AI Speech'}
                  </div>
                  <div className="text-xs opacity-90">
                    {isAzurePlaying ? 'Click to stop' : 'Cloud • Premium'}
                  </div>
                </div>
              </button>

              <div className="space-y-2">
                {webSpeechError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-md text-sm">
                    Web Speech: {webSpeechError}
                  </div>
                )}
                {azureError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-md text-sm">
                    Azure: {azureError}
                  </div>
                )}
                {!hasWebSpeech && (
                  <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 py-2 rounded-md text-sm">
                    Web Speech not supported
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              Web Speech API
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Built into modern browsers</li>
              <li>• No API keys required</li>
              <li>• Free to use</li>
              <li>• Works offline</li>
              <li>• Multiple voice options</li>
            </ul>
          </div>

          <div className="bg-green-50 p-6 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Azure AI Speech
            </h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Professional neural voices</li>
              <li>• High-quality consistent output</li>
              <li>• 100+ languages supported</li>
              <li>• Custom voice training</li>
              <li>• Enterprise-grade reliability</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}