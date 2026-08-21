import { Volume2, VolumeX } from 'lucide-react';
import { useSpeech } from '../hooks/useSpeech';

export default function SpeakButton({ text, className = '' }) {
  const { toggle, speaking } = useSpeech();

  return (
    <button
      onClick={() => toggle(text)}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 ${
        speaking
          ? 'bg-safetyLime text-brandDark'
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
      } ${className}`}
      title="Listen aloud"
    >
      {speaking ? <Volume2 size={14} /> : <VolumeX size={14} />}
      {speaking ? 'Playing...' : 'Listen'}
    </button>
  );
}
