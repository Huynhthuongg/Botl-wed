import { Message } from '../types';
import { User, Bot } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

function formatContent(content: string) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
      elements.push(
        <p key={i} className="font-semibold text-current mt-3 mb-1 first:mt-0">
          {line.slice(2, -2)}
        </p>
      );
    } else if (line.startsWith('- [ ] ') || line.startsWith('- [x] ')) {
      const checked = line.startsWith('- [x] ');
      elements.push(
        <div key={i} className="flex items-start gap-2 my-0.5">
          <div className={`mt-0.5 w-4 h-4 shrink-0 rounded border flex items-center justify-center text-xs ${checked ? 'bg-blue-500 border-blue-500 text-white' : 'border-current opacity-50'}`}>
            {checked && '✓'}
          </div>
          <span className={checked ? 'line-through opacity-50' : ''}>{line.slice(6)}</span>
        </div>
      );
    } else if (line.startsWith('- ')) {
      elements.push(
        <div key={i} className="flex items-start gap-2 my-0.5">
          <span className="mt-1.5 w-1.5 h-1.5 shrink-0 rounded-full bg-current opacity-50" />
          <span>{line.slice(2)}</span>
        </div>
      );
    } else if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <div key={i} className="my-2 rounded-lg overflow-hidden">
          {lang && (
            <div className="bg-black/30 px-3 py-1 text-xs text-white/40 font-mono border-b border-white/10">
              {lang}
            </div>
          )}
          <pre className="bg-black/30 px-4 py-3 text-xs font-mono text-green-300 overflow-x-auto whitespace-pre-wrap">
            {codeLines.join('\n')}
          </pre>
        </div>
      );
    } else if (line.match(/^\d+\.\s/)) {
      elements.push(
        <div key={i} className="flex items-start gap-2 my-0.5">
          <span className="shrink-0 font-semibold opacity-60">{line.match(/^\d+/)?.[0]}.</span>
          <span>{line.replace(/^\d+\.\s/, '')}</span>
        </div>
      );
    } else if (line.trim() === '') {
      if (elements.length > 0) {
        elements.push(<div key={i} className="h-2" />);
      }
    } else {
      elements.push(<p key={i} className="leading-relaxed">{line}</p>);
    }

    i++;
  }

  return elements;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser
          ? 'bg-blue-500'
          : 'bg-slate-700 border border-white/10'
      }`}>
        {isUser
          ? <User size={14} className="text-white" />
          : <Bot size={14} className="text-slate-300" />
        }
      </div>

      <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
        isUser
          ? 'bg-blue-500 text-white rounded-tr-sm'
          : 'bg-slate-800 text-slate-200 border border-white/5 rounded-tl-sm'
      }`}>
        <div className="space-y-0.5">
          {formatContent(message.content)}
        </div>
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <div className="shrink-0 w-8 h-8 rounded-full bg-slate-700 border border-white/10 flex items-center justify-center">
        <Bot size={14} className="text-slate-300" />
      </div>
      <div className="bg-slate-800 border border-white/5 rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
