import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface MessageInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + 'px';
    }
  }, [value]);

  const handleSend = () => {
    const msg = value.trim();
    if (!msg || disabled) return;
    onSend(msg);
    setValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t border-white/5 bg-[#1a1d27]">
      <div className="max-w-3xl mx-auto">
        <div className={`flex items-end gap-3 bg-slate-800 border rounded-2xl px-4 py-3 transition-all duration-200 ${
          disabled ? 'border-white/5 opacity-60' : 'border-white/10 focus-within:border-blue-500/50'
        }`}>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about deployments, setup, security..."
            disabled={disabled}
            rows={1}
            className="flex-1 bg-transparent text-slate-200 text-sm placeholder-slate-500 resize-none outline-none leading-relaxed min-h-[24px]"
          />
          <button
            onClick={handleSend}
            disabled={!value.trim() || disabled}
            className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 ${
              value.trim() && !disabled
                ? 'bg-blue-500 hover:bg-blue-400 text-white'
                : 'bg-white/5 text-white/20 cursor-not-allowed'
            }`}
          >
            {disabled
              ? <Loader2 size={14} className="animate-spin" />
              : <Send size={14} />
            }
          </button>
        </div>
        <p className="text-center text-slate-600 text-xs mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
