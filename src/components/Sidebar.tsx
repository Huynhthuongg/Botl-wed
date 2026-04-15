import { useState } from 'react';
import { MessageSquare, Plus, Trash2, CreditCard as Edit3, Check, X } from 'lucide-react';
import { Conversation } from '../types';

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
}

export function Sidebar({ conversations, activeId, onSelect, onNew, onDelete, onRename }: SidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const startEdit = (conv: Conversation, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(conv.id);
    setEditValue(conv.title);
  };

  const confirmEdit = (id: string) => {
    if (editValue.trim()) {
      onRename(id, editValue.trim());
    }
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  return (
    <aside className="w-64 bg-[#0f1117] flex flex-col h-full border-r border-white/5">
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center">
            <MessageSquare size={14} className="text-white" />
          </div>
          <span className="text-white font-semibold text-sm tracking-wide">AI Chat</span>
        </div>
        <button
          onClick={onNew}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-sm transition-all duration-150 border border-white/10 hover:border-white/20"
        >
          <Plus size={14} />
          New conversation
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
        {conversations.length === 0 && (
          <p className="text-white/30 text-xs text-center mt-8 px-4">
            No conversations yet. Start one!
          </p>
        )}
        {conversations.map(conv => (
          <div
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={`group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150 ${
              activeId === conv.id
                ? 'bg-white/10 text-white'
                : 'text-white/50 hover:text-white/80 hover:bg-white/5'
            }`}
          >
            <MessageSquare size={13} className="shrink-0 opacity-60" />

            {editingId === conv.id ? (
              <div className="flex-1 flex items-center gap-1" onClick={e => e.stopPropagation()}>
                <input
                  autoFocus
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') confirmEdit(conv.id);
                    if (e.key === 'Escape') cancelEdit();
                  }}
                  className="flex-1 bg-white/10 text-white text-xs px-2 py-1 rounded border border-white/20 outline-none min-w-0"
                />
                <button onClick={() => confirmEdit(conv.id)} className="text-green-400 hover:text-green-300">
                  <Check size={12} />
                </button>
                <button onClick={cancelEdit} className="text-red-400 hover:text-red-300">
                  <X size={12} />
                </button>
              </div>
            ) : (
              <>
                <span className="flex-1 text-xs truncate">{conv.title}</span>
                <div className={`flex items-center gap-1 transition-opacity ${activeId === conv.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                  <button
                    onClick={e => startEdit(conv, e)}
                    className="p-1 hover:text-blue-400 transition-colors"
                  >
                    <Edit3 size={11} />
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); onDelete(conv.id); }}
                    className="p-1 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-white/5">
        <p className="text-white/20 text-xs text-center">Powered by AI</p>
      </div>
    </aside>
  );
}
