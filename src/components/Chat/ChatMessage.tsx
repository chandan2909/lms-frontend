import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === 'user';
  
  return (
    <div className={`py-6 px-4 ${isUser ? 'bg-white' : 'bg-[#f7f9fa] border-y border-gray-100'}`}>
      <div className="max-w-3xl mx-auto flex gap-6">
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-sm flex-shrink-0 flex items-center justify-center font-bold text-sm ${
          isUser ? 'bg-[#1c1d1f] text-white' : 'bg-[#a435f0] text-white'
        }`}>
          {isUser ? 'U' : 'AI'}
        </div>
        
        {/* Message Content */}
        <div className="min-w-0 flex-1 flex flex-col justify-center">
          <div className="prose prose-sm md:prose-base max-w-none text-[#1c1d1f]">
            {isUser ? (
              <div className="whitespace-pre-wrap">{content}</div>
            ) : (
              <ReactMarkdown>{content}</ReactMarkdown>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
