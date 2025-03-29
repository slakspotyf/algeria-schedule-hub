
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { MessageCircle, SendIcon, BotIcon, XIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Default AI messages for the initial state
const defaultMessages = [
  {
    role: 'assistant',
    content: 'Hello! I\'m your AI assistant. How can I help you with your social media automation today?'
  }
];

const AIChatbot = () => {
  const [messages, setMessages] = useState(defaultMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const sendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage = { role: 'user', content: input };
    
    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // In a real implementation, this would call an API with the user's message
      // For now, we'll just simulate a response after a short delay
      setTimeout(() => {
        const responses = [
          "I can help you schedule posts across multiple platforms at once.",
          "Try connecting your social accounts first by clicking on the platform icons.",
          "You can automate content posting to save time and ensure consistent messaging.",
          "Need help with a specific platform? Let me know which one you're working with."
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: randomResponse
        }]);
        
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to get response from assistant. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg bg-primary text-white hover:bg-primary/90"
          aria-label="Open AI Chatbot"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 sm:w-96 p-0 rounded-lg shadow-lg border-primary/10 mb-6 mr-6" 
        side="top" 
        align="end"
      >
        <div className="bg-primary text-white p-3 rounded-t-lg flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BotIcon className="h-5 w-5" />
            <span className="font-medium">AI Assistant</span>
          </div>
          <Button variant="ghost" size="icon" onClick={closeChat} className="h-8 w-8 text-white hover:bg-primary/80">
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="h-80 overflow-y-auto p-4 flex flex-col gap-3">
          {messages.map((msg, i) => (
            <div 
              key={i}
              className={`max-w-[85%] p-3 rounded-lg ${
                msg.role === 'user' 
                  ? 'bg-primary/10 ml-auto rounded-tr-none' 
                  : 'bg-muted/50 mr-auto rounded-tl-none'
              }`}
            >
              {msg.content}
            </div>
          ))}
          {isLoading && (
            <div className="bg-muted/50 mr-auto rounded-lg rounded-tl-none max-w-[85%] p-3">
              <div className="flex gap-1">
                <span className="animate-bounce">•</span>
                <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>•</span>
                <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>•</span>
              </div>
            </div>
          )}
        </div>
        
        <form onSubmit={sendMessage} className="p-3 border-t border-border">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={isLoading || !input.trim()}
              className="shrink-0"
            >
              <SendIcon className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default AIChatbot;
