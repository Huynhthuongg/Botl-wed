import { useEffect, useRef, useState } from 'react';
import { MessageBubble, TypingIndicator } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { WelcomeScreen } from './WelcomeScreen';
import { useMessages } from '../hooks/useMessages';
import { generateAIResponse } from '../lib/aiResponder';
import { supabase } from '../lib/supabase';
import { Message } from '../types';

interface ChatAreaProps {
  conversationId: string | null;
  onFirstMessage: (id: string, title: string) => void;
  onNewConversation: () => Promise<string | null>;
}

export function ChatArea({ conversationId, onFirstMessage, onNewConversation }: ChatAreaProps) {
  const { messages, loading, addMessage } = useMessages(conversationId);
  const [typing, setTyping] = useState(false);
  const [activeConvId, setActiveConvId] = useState<string | null>(conversationId);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveConvId(conversationId);
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const handleSend = async (text: string) => {
    let convId = activeConvId;

    if (!convId) {
      convId = await onNewConversation();
      if (!convId) return;
      setActiveConvId(convId);
    }

    await addMessage(convId, 'user', text);

    if (messages.length === 0) {
      const title = text.slice(0, 40) + (text.length > 40 ? '...' : '');
      onFirstMessage(convId, title);
      await supabase
        .from('conversations')
        .update({ title, updated_at: new Date().toISOString() })
        .eq('id', convId);
    } else {
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', convId);
    }

    setTyping(true);
    const reply = await generateAIResponse(text);
    setTyping(false);

    await addMessage(convId, 'assistant', reply);
  };

  const handleSuggestion = async (text: string) => {
    await handleSend(text);
  };

  const showWelcome = !loading && messages.length === 0 && !typing;

  return (
    <div className="flex-1 flex flex-col bg-[#13161f] min-w-0">
      <div className="flex-1 overflow-y-auto">
        {showWelcome ? (
          <WelcomeScreen onSuggestion={handleSuggestion} />
        ) : (
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
            {loading && (
              <div className="flex justify-center py-8">
                <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
              </div>
            )}
            {(messages as Message[]).map(msg => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {typing && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <MessageInput onSend={handleSend} disabled={typing} />
    </div>
  );
}
