import { useState, useEffect, useRef } from 'react';
import { renderMessage } from '../utils/renderMessage';

export default function TypingMessage({ text, onComplete }) {
  const [displayedText, setDisplayedText] = useState('');
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    indexRef.current = 0;
    setDisplayedText('');
    setDone(false);

    intervalRef.current = setInterval(() => {
      if (indexRef.current < text.length) {
        const next = Math.min(indexRef.current + 3, text.length);
        setDisplayedText(text.slice(0, next));
        indexRef.current = next;
      } else {
        clearInterval(intervalRef.current);
        setDone(true);
        onComplete?.();
      }
    }, 15);

    return () => clearInterval(intervalRef.current);
  }, [text]);

  if (done) {
    return <div className="space-y-2">{renderMessage(text)}</div>;
  }

  return (
    <div className="space-y-2">
      {renderMessage(displayedText)}
      <span className="inline-block w-1.5 h-4 bg-brandDark/60 animate-pulse ml-0.5 rounded-sm align-middle" />
    </div>
  );
}
