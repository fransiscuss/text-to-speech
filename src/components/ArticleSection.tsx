export default function ArticleSection() {
  return (
    <div className="max-w-4xl mx-auto">
      <article className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Understanding Text-to-Speech Technologies
        </h2>

        <div className="prose prose-lg max-w-none text-gray-700">
          <p className="text-lg leading-relaxed mb-6">
            Text-to-Speech (TTS) technology has evolved dramatically over the past decade,
            transforming how applications interact with users through voice. This demonstration
            compares two distinct approaches to implementing TTS in modern web applications.
          </p>

          <section className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">What is Text-to-Speech?</h3>
            <p className="mb-4">
              Text-to-Speech is the artificial production of human speech that converts written text
              into spoken words. Modern TTS systems use advanced machine learning algorithms to generate
              natural-sounding speech that closely mimics human vocal patterns, intonation, and rhythm.
            </p>
            <p>
              The applications of TTS technology are vast and growing, including accessibility tools for
              visually impaired users, virtual assistants, audiobook creation, language learning applications,
              and customer service automation.
            </p>
          </section>

          <section className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Approach 1: Web Speech API</h3>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
              <h4 className="font-semibold text-blue-800 mb-2">Browser-Native Solution</h4>
              <p className="text-blue-700">
                The Web Speech API is a web standard that provides speech synthesis capabilities directly
                in modern web browsers without requiring external services or API keys.
              </p>
            </div>

            <h4 className="text-xl font-semibold text-gray-700 mb-3">Key Features:</h4>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Free and Built-in:</strong> No subscription fees or API costs</li>
              <li><strong>Privacy-Focused:</strong> All processing happens locally on the user&apos;s device</li>
              <li><strong>Offline Capability:</strong> Works without internet connection</li>
              <li><strong>Multiple Voices:</strong> Access to system-installed voices in various languages</li>
              <li><strong>Low Latency:</strong> Fast response time for immediate playback</li>
              <li><strong>Easy Implementation:</strong> Simple JavaScript API integration</li>
            </ul>

            <h4 className="text-xl font-semibold text-gray-700 mb-3">Limitations:</h4>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Quality Variability:</strong> Voice quality depends on the user&apos;s system</li>
              <li><strong>Browser Support:</strong> Not supported in all browsers equally</li>
              <li><strong>Limited Customization:</strong> Few options for voice modification</li>
              <li><strong>Inconsistent Experience:</strong> Different voices across devices and platforms</li>
            </ul>

            <div className="bg-gray-100 p-4 rounded-md">
              <h5 className="font-mono text-sm text-gray-600 mb-2">Implementation Example:</h5>
              <pre className="bg-gray-800 text-gray-100 p-3 rounded-md text-sm overflow-x-auto">
                <code>{`const utterance = new SpeechSynthesisUtterance(text);
utterance.voice = speechSynthesis.getVoices()[0];
speechSynthesis.speak(utterance);`}</code>
              </pre>
            </div>
          </section>

          <section className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Approach 2: Azure AI Speech</h3>
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
              <h4 className="font-semibold text-green-800 mb-2">Cloud-Based Enterprise Solution</h4>
              <p className="text-green-700">
                Azure AI Speech is Microsoft&apos;s cloud-based speech service that provides
                high-quality neural voice synthesis with advanced features and customization options.
              </p>
            </div>

            <h4 className="text-xl font-semibold text-gray-700 mb-3">Key Features:</h4>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Neural Voice Quality:</strong> State-of-the-art neural TTS technology</li>
              <li><strong>Consistent Experience:</strong> Same high-quality voices across all platforms</li>
              <li><strong>Multiple Languages:</strong> Support for 100+ languages and variants</li>
              <li><strong>Custom Neural Voices:</strong> Create custom voices from audio samples</li>
              <li><strong>SSML Support:</strong> Speech Synthesis Markup Language for fine control</li>
              <li><strong>Style Control:</strong> Adjust speaking style, pitch, rate, and volume</li>
              <li><strong>Scalability:</strong> Handles high volumes and concurrent requests</li>
              <li><strong>Enterprise Support:</strong> SLA guarantees and technical support</li>
            </ul>

            <h4 className="text-xl font-semibold text-gray-700 mb-3">Considerations:</h4>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Cost:</strong> Pay-per-use pricing model applies</li>
              <li><strong>Internet Required:</strong> Requires active internet connection</li>
              <li><strong>API Management:</strong> Requires subscription key and region configuration</li>
              <li><strong>Data Privacy:</strong> Text is processed on Azure servers</li>
            </ul>

            <div className="bg-gray-100 p-4 rounded-md">
              <h5 className="font-mono text-sm text-gray-600 mb-2">Implementation Example:</h5>
              <pre className="bg-gray-800 text-gray-100 p-3 rounded-md text-sm overflow-x-auto">
                <code>{`const speechConfig = SpeechConfig.fromSubscription(
  subscriptionKey, region
);
const synthesizer = new SpeechSynthesizer(speechConfig);
synthesizer.speakTextAsync(text, result => {
  // Handle result
});`}</code>
              </pre>
            </div>
          </section>

          <section className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Comparison Summary</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">Feature</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Web Speech API</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Azure AI Speech</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-medium">Cost</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">Free</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">Pay-per-use</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 font-medium">Quality</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">Variable</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">High/Consistent</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-medium">Offline Support</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">✓</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">✗</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 font-medium">Custom Voices</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">✗</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">✓</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-medium">Privacy</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">Local processing</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">Cloud processing</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 font-medium">Setup Complexity</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">Low</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">Medium</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">When to Use Each Approach</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h4 className="text-xl font-semibold text-blue-800 mb-3">Choose Web Speech API for:</h4>
                <ul className="space-y-2 text-blue-700">
                  <li>• Prototypes and proof-of-concepts</li>
                  <li>• Educational projects and demonstrations</li>
                  <li>• Applications with limited budgets</li>
                  <li>• Privacy-focused applications</li>
                  <li>• Offline-capable applications</li>
                  <li>• Simple voice requirements</li>
                </ul>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <h4 className="text-xl font-semibold text-green-800 mb-3">Choose Azure AI Speech for:</h4>
                <ul className="space-y-2 text-green-700">
                  <li>• Production applications</li>
                  <li>• Enterprise-grade solutions</li>
                  <li>• Applications requiring high-quality voices</li>
                  <li>• Multi-language support</li>
                  <li>• Custom voice branding</li>
                  <li>• Scalable applications</li>
                  <li>• Professional voice applications</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </article>
    </div>
  );
}