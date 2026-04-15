import { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { useConversations } from './hooks/useConversations';
import { Menu, X } from 'lucide-react';

function App() {
  const { conversations, loading, createConversation, deleteConversation, updateTitle } = useConversations();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleNew = useCallback(async () => {
    const conv = await createConversation();
    if (conv) setActiveId(conv.id);
  }, [createConversation]);

  const handleNewConversation = useCallback(async (): Promise<string | null> => {
    const conv = await createConversation();
    if (conv) {
      setActiveId(conv.id);
      return conv.id;
    }
    return null;
  }, [createConversation]);

  const handleDelete = useCallback(async (id: string) => {
    await deleteConversation(id);
    if (activeId === id) setActiveId(null);
  }, [deleteConversation, activeId]);

  const handleFirstMessage = useCallback((id: string, title: string) => {
    updateTitle(id, title);
  }, [updateTitle]);

  return (
    <div className="h-screen flex bg-[#13161f] text-white overflow-hidden">
      <div className={`transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0'} overflow-hidden shrink-0`}>
        {!loading && (
          <Sidebar
            conversations={conversations}
            activeId={activeId}
            onSelect={setActiveId}
            onNew={handleNew}
            onDelete={handleDelete}
            onRename={updateTitle}
          />
        )}
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-12 border-b border-white/5 flex items-center gap-3 px-4 bg-[#1a1d27] shrink-0">
          <button
            onClick={() => setSidebarOpen(o => !o)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
          <div className="h-4 w-px bg-white/10" />
          <span className="text-slate-300 text-sm font-medium">
            {activeId
              ? conversations.find(c => c.id === activeId)?.title ?? 'Conversation'
              : 'AI Deployment Assistant'
            }
          </span>
        </header>

        <ChatArea
          key={activeId}
          conversationId={activeId}
          onFirstMessage={handleFirstMessage}
          onNewConversation={handleNewConversation}
        />
      </div>
    </div>
  );
}

export default App;
