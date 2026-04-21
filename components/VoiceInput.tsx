"use client";
import { useState } from "react";
import { Mic, MicOff } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  onTranscript: (text: string) => void;
}

export default function VoiceInput({ onTranscript }: Props) {
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  const toggleVoice = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      toast.error("Browser voice support nahi hai!");
      return;
    }

    if (listening) {
      recognition?.stop();
      setListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const rec = new SpeechRecognition();
    rec.lang = "en-US";
    rec.continuous = false;
    rec.interimResults = false;

    rec.onstart = () => setListening(true);
    rec.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
      toast.success(`🎤 "${transcript}"`);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => { setListening(false); toast.error("Voice failed!"); };

    rec.start();
    setRecognition(rec);
  };

  return (
    <button
      onClick={toggleVoice}
      className={`p-2.5 rounded-xl border transition ${
        listening
          ? "bg-red-500/20 border-red-500/40 text-red-400 animate-pulse"
          : "border-[#1e1e2e] text-gray-500 hover:text-gray-300 hover:border-indigo-500/50"
      }`}
      title={listening ? "Stop listening" : "Voice input"}
    >
      {listening ? <MicOff size={16} /> : <Mic size={16} />}
    </button>
  );
}