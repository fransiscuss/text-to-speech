'use client';

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { SpeechSynthesizer, SpeakerAudioDestination } from 'microsoft-cognitiveservices-speech-sdk';

interface SpeechContextType {
  isWebSpeechPlaying: boolean;
  isAzurePlaying: boolean;
  isAzureLoading: boolean;
  isHumePlaying: boolean;
  isHumeLoading: boolean;
  webSpeechError: string | null;
  azureError: string | null;
  humeError: string | null;
  availableVoices: Array<{ name: string; lang: string; default: boolean }>;
  selectedVoice: string | null;
  azureVoices: Array<{ name: string; lang: string; gender: string }>;
  selectedAzureVoice: string | null;
  humeVoices: Array<{ name: string; description: string }>;
  selectedHumeVoice: string | null;
  playWebSpeech: (text: string, voice?: string) => void;
  stopWebSpeech: () => void;
  playAzureSpeech: (text: string, subscriptionKey: string, region: string) => void;
  stopAzureSpeech: () => void;
  playHumeSpeech: (text: string, apiKey: string) => void;
  stopHumeSpeech: () => void;
  setSelectedVoiceName: (voiceName: string) => void;
  setSelectedAzureVoiceName: (voiceName: string) => void;
  setSelectedHumeVoiceName: (voiceName: string) => void;
}

const SpeechContext = createContext<SpeechContextType | undefined>(undefined);

export function SpeechSynthesisProvider({ children }: { children: React.ReactNode }) {
  const [isWebSpeechPlaying, setIsWebSpeechPlaying] = useState(false);
  const [isAzurePlaying, setIsAzurePlaying] = useState(false);
  const [isAzureLoading, setIsAzureLoading] = useState(false);
  const [isHumePlaying, setIsHumePlaying] = useState(false);
  const [isHumeLoading, setIsHumeLoading] = useState(false);
  const [webSpeechError, setWebSpeechError] = useState<string | null>(null);
  const [azureError, setAzureError] = useState<string | null>(null);
  const [humeError, setHumeError] = useState<string | null>(null);
  const [availableVoices, setAvailableVoices] = useState<Array<{ name: string; lang: string; default: boolean }>>([]);
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  const [azureVoices, setAzureVoices] = useState<Array<{ name: string; lang: string; gender: string }>>([]);
  const [selectedAzureVoice, setSelectedAzureVoice] = useState<string | null>(null);
  const [humeVoices, setHumeVoices] = useState<Array<{ name: string; description: string }>>([]);
  const [selectedHumeVoice, setSelectedHumeVoice] = useState<string | null>(null);

  const azureSpeechRef = useRef<SpeechSynthesizer | null>(null);
  const azureSpeakerRef = useRef<SpeakerAudioDestination | null>(null);
  const isAzureStoppingRef = useRef(false);
  const isAzureBusyRef = useRef(false);

  const humeAudioRef = useRef<HTMLAudioElement | null>(null);
  const isHumeBusyRef = useRef(false);

  const stopAzureSpeech = useCallback(() => {
    isAzureStoppingRef.current = true;
    setIsAzurePlaying(false);
    setIsAzureLoading(false);

    if (azureSpeakerRef.current) {
      try {
        azureSpeakerRef.current.pause();
      } catch (error) {
        console.warn('Error pausing Azure speaker:', error);
      }
      try {
        azureSpeakerRef.current.close();
      } catch (error) {
        console.warn('Error closing Azure speaker:', error);
      }
      azureSpeakerRef.current = null;
    }

    if (azureSpeechRef.current) {
      try {
        azureSpeechRef.current.close();
      } catch (error) {
        console.warn('Error closing Azure speech synthesizer:', error);
      }
      azureSpeechRef.current = null;
    }

    isAzureBusyRef.current = false;
  }, []);

  const stopHumeSpeech = useCallback(() => {
    if (humeAudioRef.current) {
      try {
        humeAudioRef.current.pause();
        humeAudioRef.current.currentTime = 0;
        if (humeAudioRef.current.src) {
          URL.revokeObjectURL(humeAudioRef.current.src);
        }
      } catch (error) {
        console.warn('Error stopping Hume audio:', error);
      }
      humeAudioRef.current = null;
    }

    setIsHumePlaying(false);
    setIsHumeLoading(false);
    isHumeBusyRef.current = false;
  }, []);

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

    const azureEnglishVoices = [
      { name: 'en-US-AvaMultilingualNeural', lang: 'en-US', gender: 'Female' },
      { name: 'en-US-JennyMultilingualNeural', lang: 'en-US', gender: 'Female' },
      { name: 'en-US-GuyMultilingualNeural', lang: 'en-US', gender: 'Male' },
      { name: 'en-US-EmmaMultilingualNeural', lang: 'en-US', gender: 'Female' },
      { name: 'en-US-BrianMultilingualNeural', lang: 'en-US', gender: 'Male' },
      { name: 'en-US-AriaNeural', lang: 'en-US', gender: 'Female' },
      { name: 'en-US-DavisNeural', lang: 'en-US', gender: 'Male' },
      { name: 'en-US-JaneNeural', lang: 'en-US', gender: 'Female' },
      { name: 'en-US-JasonNeural', lang: 'en-US', gender: 'Male' },
      { name: 'en-US-SaraNeural', lang: 'en-US', gender: 'Female' },
      { name: 'en-US-TonyNeural', lang: 'en-US', gender: 'Male' },
      { name: 'en-US-NancyNeural', lang: 'en-US', gender: 'Female' },
      { name: 'en-US-AmberNeural', lang: 'en-US', gender: 'Female' },
      { name: 'en-US-AnaNeural', lang: 'en-US', gender: 'Female' },
      { name: 'en-US-AshleyNeural', lang: 'en-US', gender: 'Female' },
      { name: 'en-US-BrandonNeural', lang: 'en-US', gender: 'Male' },
      { name: 'en-US-ChristopherNeural', lang: 'en-US', gender: 'Male' },
      { name: 'en-US-CoraNeural', lang: 'en-US', gender: 'Female' },
      { name: 'en-US-ElizabethNeural', lang: 'en-US', gender: 'Female' },
      { name: 'en-US-EricNeural', lang: 'en-US', gender: 'Male' },
      { name: 'en-US-JacobNeural', lang: 'en-US', gender: 'Male' },
      { name: 'en-US-JessicaNeural', lang: 'en-US', gender: 'Female' },
      { name: 'en-US-MichelleNeural', lang: 'en-US', gender: 'Female' },
      { name: 'en-US-MonicaNeural', lang: 'en-US', gender: 'Female' },
      { name: 'en-US-RogerNeural', lang: 'en-US', gender: 'Male' },
      { name: 'en-US-SteffanNeural', lang: 'en-US', gender: 'Male' }
    ];
    setAzureVoices(azureEnglishVoices);

    if (!selectedAzureVoice) {
      setSelectedAzureVoice('en-US-JennyMultilingualNeural');
    }

    const humeVoiceList = [
      { name: 'Ava Song', description: 'Warm female voice' },
      { name: 'Donovan Sinclair', description: 'Professional male voice' },
      { name: 'Vince Douglas', description: 'Enthusiastic male voice' },
      { name: 'Male English Actor', description: 'British male actor' },
      { name: 'Stella Karter', description: 'Energetic female voice' },
      { name: 'Dacher', description: 'Calm male voice' },
      { name: 'Aura', description: 'Soft female voice' },
      { name: 'Kora', description: 'Clear female voice' },
      { name: 'Finn', description: 'Friendly male voice' },
      { name: 'Zeke', description: 'Deep male voice' },
    ];
    setHumeVoices(humeVoiceList);

    if (!selectedHumeVoice) {
      setSelectedHumeVoice('Ava Song');
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        window.speechSynthesis.onvoiceschanged = null;
      }
      stopAzureSpeech();
      stopHumeSpeech();
    };
  }, [selectedVoice, selectedAzureVoice, selectedHumeVoice, stopAzureSpeech, stopHumeSpeech]);

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
        if (event.error !== 'interrupted' && event.error !== 'canceled') {
          setWebSpeechError(`Web Speech Error: ${event.error}`);
        }
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

  const playAzureSpeech = useCallback(async (text: string, subscriptionKey: string, region: string) => {
    if (isAzureBusyRef.current) {
      return;
    }

    try {
      const { SpeechConfig, AudioConfig, SpeakerAudioDestination, SpeechSynthesizer } = await import('microsoft-cognitiveservices-speech-sdk');

      if (!subscriptionKey || !region) {
        setAzureError('Azure subscription key and region are required');
        return;
      }

      setAzureError(null);

      // Stop any existing speech first
      stopAzureSpeech();

      isAzureBusyRef.current = true;
      setIsAzureLoading(true);

      const speechConfig = SpeechConfig.fromSubscription(subscriptionKey, region);
      speechConfig.speechSynthesisLanguage = 'en-US';
      speechConfig.speechSynthesisVoiceName = selectedAzureVoice || 'en-US-JennyMultilingualNeural';

      const player = new SpeakerAudioDestination();
      azureSpeakerRef.current = player;

      player.onAudioEnd = () => {
        if (!isAzureStoppingRef.current) {
          setIsAzurePlaying(false);
          isAzureBusyRef.current = false;
        }
      };

      const audioConfig = AudioConfig.fromSpeakerOutput(player);
      const synthesizer = new SpeechSynthesizer(speechConfig, audioConfig);
      azureSpeechRef.current = synthesizer;
      isAzureStoppingRef.current = false;

      setIsAzureLoading(false);
      setIsAzurePlaying(true);

      synthesizer.speakTextAsync(
        text,
        () => {
          synthesizer.close();
          azureSpeechRef.current = null;
        },
        (error) => {
          if (!isAzureStoppingRef.current) {
            setIsAzurePlaying(false);
            setAzureError(`Azure Speech Error: ${error}`);
            isAzureBusyRef.current = false;
          }
          synthesizer.close();
          azureSpeechRef.current = null;
        }
      );
    } catch (error) {
      setIsAzureLoading(false);
      setIsAzurePlaying(false);
      isAzureBusyRef.current = false;
      setAzureError(`Azure Speech Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [selectedAzureVoice, stopAzureSpeech]);

  const playHumeSpeech = useCallback(async (text: string, apiKey: string) => {
    if (isHumeBusyRef.current) {
      return;
    }

    if (!apiKey) {
      setHumeError('Hume API key is required');
      return;
    }

    setHumeError(null);
    stopHumeSpeech();

    isHumeBusyRef.current = true;
    setIsHumeLoading(true);

    const voiceName = selectedHumeVoice || 'Ava Song';

    try {
      const response = await fetch('https://api.hume.ai/v0/tts/file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Hume-Api-Key': apiKey,
        },
        body: JSON.stringify({
          utterances: [
            {
              text,
              voice: {
                name: voiceName,
                provider: 'HUME_AI',
              },
            },
          ],
          format: {
            type: 'mp3',
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage: string;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorJson.detail || errorText;
        } catch {
          errorMessage = errorText;
        }
        throw new Error(`API error ${response.status}: ${errorMessage}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      audio.onended = () => {
        setIsHumePlaying(false);
        isHumeBusyRef.current = false;
        URL.revokeObjectURL(audioUrl);
        humeAudioRef.current = null;
      };

      audio.onerror = () => {
        setIsHumePlaying(false);
        setHumeError('Hume Error: Failed to play audio');
        isHumeBusyRef.current = false;
        URL.revokeObjectURL(audioUrl);
        humeAudioRef.current = null;
      };

      humeAudioRef.current = audio;
      setIsHumeLoading(false);
      setIsHumePlaying(true);

      await audio.play();
    } catch (error) {
      setIsHumeLoading(false);
      setIsHumePlaying(false);
      isHumeBusyRef.current = false;
      setHumeError(`Hume Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [selectedHumeVoice, stopHumeSpeech]);

  const setSelectedVoiceName = (voiceName: string) => {
    setSelectedVoice(voiceName);
  };

  const setSelectedAzureVoiceName = (voiceName: string) => {
    setSelectedAzureVoice(voiceName);
  };

  const setSelectedHumeVoiceName = (voiceName: string) => {
    setSelectedHumeVoice(voiceName);
  };

  return (
    <SpeechContext.Provider value={{
      isWebSpeechPlaying,
      isAzurePlaying,
      isAzureLoading,
      isHumePlaying,
      isHumeLoading,
      webSpeechError,
      azureError,
      humeError,
      availableVoices,
      selectedVoice,
      azureVoices,
      selectedAzureVoice,
      humeVoices,
      selectedHumeVoice,
      playWebSpeech,
      stopWebSpeech,
      playAzureSpeech,
      stopAzureSpeech,
      playHumeSpeech,
      stopHumeSpeech,
      setSelectedVoiceName,
      setSelectedAzureVoiceName,
      setSelectedHumeVoiceName,
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
