'use client';

import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

interface SpeechContextType {
  isWebSpeechPlaying: boolean;
  isAzurePlaying: boolean;
  webSpeechError: string | null;
  azureError: string | null;
  playWebSpeech: (text: string, voice?: string) => void;
  stopWebSpeech: () => void;
  playAzureSpeech: (text: string, subscriptionKey: string, region: string) => void;
  stopAzureSpeech: () => void;
}

const SpeechContext = createContext<SpeechContextType | undefined>(undefined);

export function SpeechSynthesisProvider({ children }: { children: React.ReactNode }) {
  const [isWebSpeechPlaying, setIsWebSpeechPlaying] = useState(false);
  const [isAzurePlaying, setIsAzurePlaying] = useState(false);
  const [webSpeechError, setWebSpeechError] = useState<string | null>(null);
  const [azureError, setAzureError] = useState<string | null>(null);

  const azureSpeechRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      stopAzureSpeech();
    };
  }, []);

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
    try {
      const { SpeechConfig, SpeechSynthesizer } = await import('microsoft-cognitiveservices-speech-sdk');

      if (!subscriptionKey || !region) {
        setAzureError('Azure subscription key and region are required');
        return;
      }

      stopAzureSpeech();

      const speechConfig = SpeechConfig.fromSubscription(subscriptionKey, region);
      speechConfig.speechSynthesisLanguage = 'en-US';
      speechConfig.speechSynthesisVoiceName = 'en-US-JennyMultilingualNeural';

      const synthesizer = new SpeechSynthesizer(speechConfig);
      azureSpeechRef.current = synthesizer;

      setIsAzurePlaying(true);
      setAzureError(null);

      synthesizer.speakTextAsync(
        text,
        (result) => {
          setIsAzurePlaying(false);
          synthesizer.close();
          azureSpeechRef.current = null;
        },
        (error) => {
          setIsAzurePlaying(false);
          setAzureError(`Azure Speech Error: ${error}`);
          synthesizer.close();
          azureSpeechRef.current = null;
        }
      );
    } catch (error) {
      setIsAzurePlaying(false);
      setAzureError(`Azure Speech Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const stopAzureSpeech = () => {
    if (azureSpeechRef.current) {
      azureSpeechRef.current.close();
      azureSpeechRef.current = null;
    }
    setIsAzurePlaying(false);
  };

  return (
    <SpeechContext.Provider value={{
      isWebSpeechPlaying,
      isAzurePlaying,
      webSpeechError,
      azureError,
      playWebSpeech,
      stopWebSpeech,
      playAzureSpeech,
      stopAzureSpeech,
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