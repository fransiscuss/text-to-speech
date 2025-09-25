'use client';

import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { SpeechSynthesizer } from 'microsoft-cognitiveservices-speech-sdk';

interface SpeechContextType {
  isWebSpeechPlaying: boolean;
  isAzurePlaying: boolean;
  isAzureLoading: boolean;
  webSpeechError: string | null;
  azureError: string | null;
  availableVoices: Array<{ name: string; lang: string; default: boolean }>;
  selectedVoice: string | null;
  playWebSpeech: (text: string, voice?: string) => void;
  stopWebSpeech: () => void;
  playAzureSpeech: (text: string, subscriptionKey: string, region: string) => void;
  stopAzureSpeech: () => void;
  setSelectedVoiceName: (voiceName: string) => void;
}

const SpeechContext = createContext<SpeechContextType | undefined>(undefined);

export function SpeechSynthesisProvider({ children }: { children: React.ReactNode }) {
  const [isWebSpeechPlaying, setIsWebSpeechPlaying] = useState(false);
  const [isAzurePlaying, setIsAzurePlaying] = useState(false);
  const [isAzureLoading, setIsAzureLoading] = useState(false);
  const [webSpeechError, setWebSpeechError] = useState<string | null>(null);
  const [azureError, setAzureError] = useState<string | null>(null);
  const [availableVoices, setAvailableVoices] = useState<Array<{ name: string; lang: string; default: boolean }>>([]);
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);

  const azureSpeechRef = useRef<SpeechSynthesizer | null>(null);
  const isAzureStoppingRef = useRef(false);

  useEffect(() => {
    const loadVoices = () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        const voices = window.speechSynthesis.getVoices();

        const filteredVoices = voices
          .filter(voice => voice.lang.startsWith('en-'))
          .map(voice => ({
            name: voice.name,
            lang: voice.lang,
            default: voice.default
          }))
          .sort((a, b) => {
            if (a.default && !b.default) return -1;
            if (!a.default && b.default) return 1;
            return a.name.localeCompare(b.name);
          });

        setAvailableVoices(filteredVoices);

        if (filteredVoices.length > 0 && !selectedVoice) {
          const defaultVoice = filteredVoices.find(voice => voice.default) || filteredVoices[0];
          setSelectedVoice(defaultVoice.name);
        }
      }
    };

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
      loadVoices();
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        window.speechSynthesis.onvoiceschanged = null;
      }
      stopAzureSpeech();
    };
  }, [selectedVoice]);

  const playWebSpeech = (text: string, voice?: string) => {
    if (!window.speechSynthesis) {
      setWebSpeechError('Web Speech API is not supported in this browser');
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);

      if (voice) {
        const voices = window.speechSynthesis.getVoices();
        const selectedVoice = voices.find(v => v.name === voice);
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
      }

      utterance.onstart = () => {
        setIsWebSpeechPlaying(true);
        setWebSpeechError(null);
      };

      utterance.onend = () => {
        setIsWebSpeechPlaying(false);
      };

      utterance.onerror = (event) => {
        setIsWebSpeechPlaying(false);
        setWebSpeechError(`Web Speech Error: ${event.error}`);
      };

      window.speechSynthesis.speak(utterance);
    } catch (error) {
      setIsWebSpeechPlaying(false);
      setWebSpeechError(`Web Speech Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const stopWebSpeech = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsWebSpeechPlaying(false);
    }
  };

  const playAzureSpeech = async (text: string, subscriptionKey: string, region: string) => {
    if (isAzureLoading || isAzurePlaying) {
      return;
    }

    try {
      const { SpeechConfig, SpeechSynthesizer } = await import('microsoft-cognitiveservices-speech-sdk');

      if (!subscriptionKey || !region) {
        setAzureError('Azure subscription key and region are required');
        return;
      }

      setIsAzureLoading(true);
      setAzureError(null);

      stopAzureSpeech();

      const speechConfig = SpeechConfig.fromSubscription(subscriptionKey, region);
      speechConfig.speechSynthesisLanguage = 'en-US';
      speechConfig.speechSynthesisVoiceName = 'en-US-JennyMultilingualNeural';

      const synthesizer = new SpeechSynthesizer(speechConfig);
      azureSpeechRef.current = synthesizer;
      isAzureStoppingRef.current = false;

      setIsAzureLoading(false);
      setIsAzurePlaying(true);

      synthesizer.speakTextAsync(
        text,
        () => {
          if (!isAzureStoppingRef.current) {
            setIsAzurePlaying(false);
          }
          synthesizer.close();
          azureSpeechRef.current = null;
          isAzureStoppingRef.current = false;
        },
        (error) => {
          if (!isAzureStoppingRef.current) {
            setIsAzurePlaying(false);
            setAzureError(`Azure Speech Error: ${error}`);
          }
          synthesizer.close();
          azureSpeechRef.current = null;
          isAzureStoppingRef.current = false;
        }
      );
    } catch (error) {
      setIsAzureLoading(false);
      setIsAzurePlaying(false);
      setAzureError(`Azure Speech Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const stopAzureSpeech = () => {
    if (azureSpeechRef.current && !isAzureStoppingRef.current) {
      isAzureStoppingRef.current = true;
      setIsAzurePlaying(false);

      try {
        azureSpeechRef.current.close();
      } catch (error) {
        console.warn('Error closing Azure speech synthesizer:', error);
      }

      azureSpeechRef.current = null;
    }
    setIsAzureLoading(false);
  };

  const setSelectedVoiceName = (voiceName: string) => {
    setSelectedVoice(voiceName);
  };

  return (
    <SpeechContext.Provider value={{
      isWebSpeechPlaying,
      isAzurePlaying,
      isAzureLoading,
      webSpeechError,
      azureError,
      availableVoices,
      selectedVoice,
      playWebSpeech,
      stopWebSpeech,
      playAzureSpeech,
      stopAzureSpeech,
      setSelectedVoiceName,
    }}>
      {children}
    </SpeechContext.Provider>
  );
}

export function useSpeech() {
  const context = useContext(SpeechContext);
  if (context === undefined) {
    throw new Error('useSpeech must be used within a SpeechSynthesisProvider');
  }
  return context;
}