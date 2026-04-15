import { Rocket, Shield, Database, Server } from 'lucide-react';

interface WelcomeScreenProps {
  onSuggestion: (text: string) => void;
}

const suggestions = [
  { icon: Rocket, label: 'Deployment plan', prompt: 'Create a comprehensive deployment plan for my Node.js app' },
  { icon: Shield, label: 'Security checklist', prompt: 'What are the security best practices before deploying to production?' },
  { icon: Database, label: 'Database migrations', prompt: 'How do I safely run database migrations in production?' },
  { icon: Server, label: 'Railway hosting', prompt: 'How do I deploy my app to Railway?' },
];

export function WelcomeScreen({ onSuggestion }: WelcomeScreenProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
      <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
        <Rocket size={24} className="text-blue-400" />
      </div>
      <h1 className="text-white text-2xl font-semibold mb-2 text-center">AI Deployment Assistant</h1>
      <p className="text-slate-400 text-sm text-center max-w-sm mb-10 leading-relaxed">
        Your expert guide for deployment planning, infrastructure setup, and DevOps best practices.
      </p>

      <div className="grid grid-cols-2 gap-3 w-full max-w-md">
        {suggestions.map(({ icon: Icon, label, prompt }) => (
          <button
            key={label}
            onClick={() => onSuggestion(prompt)}
            className="flex flex-col items-start gap-3 p-4 bg-slate-800/50 hover:bg-slate-800 border border-white/5 hover:border-blue-500/30 rounded-xl text-left transition-all duration-200 group"
          >
            <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
              <Icon size={15} className="text-blue-400" />
            </div>
            <span className="text-slate-300 text-xs font-medium leading-snug">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
