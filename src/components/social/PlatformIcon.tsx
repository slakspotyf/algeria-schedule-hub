
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { RefreshCw } from 'lucide-react';

export type PlatformIconProps = {
  name: string;
  icon: string;
  color: string;
  isConnected: boolean;
  onClick: () => void;
  isLoading?: boolean;
};

const PlatformIcon = ({ name, icon, color, isConnected, onClick, isLoading }: PlatformIconProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Button
      variant="outline"
      className={cn(
        "h-auto py-4 px-4 flex-col items-center justify-center gap-3 rounded-xl relative overflow-hidden",
        isConnected ? "border-primary/50" : "border-dashed",
        "transition-all duration-300 hover:scale-105"
      )}
      onClick={onClick}
      disabled={isLoading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background */}
      <div 
        className={cn(
          "absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full transition-transform duration-1000",
          isHovered && "translate-x-full"
        )}
      ></div>
      
      <div className={cn(
        "w-12 h-12 rounded-full flex items-center justify-center relative transition-all duration-300",
        isConnected ? color : `${color}/10`,
        isHovered && "scale-110"
      )}>
        {isLoading ? (
          <RefreshCw className="w-6 h-6 text-white animate-spin" />
        ) : (
          <img src={icon} alt={name} className="w-6 h-6" />
        )}
        {isConnected && (
          <div className="absolute -bottom-1 -right-1 bg-green-500 border-2 border-background w-4 h-4 rounded-full" />
        )}
      </div>
      <span className="text-sm relative z-10">
        {isConnected ? `${name} Connected` : `Connect ${name}`}
      </span>
    </Button>
  );
};

export default PlatformIcon;
