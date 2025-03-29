
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Locale, localeNames } from '@/translations';
import { Check, Globe, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const LanguageSelector = () => {
  const { locale, changeLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);

  const handleSelectLanguage = (newLocale: Locale) => {
    changeLanguage(newLocale);
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1">
          <Globe className="h-4 w-4 mr-1" />
          {localeNames[locale]}
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {Object.entries(localeNames).map(([localeKey, localeName]) => (
          <DropdownMenuItem
            key={localeKey}
            onClick={() => handleSelectLanguage(localeKey as Locale)}
            className={`flex items-center justify-between ${locale === localeKey ? 'bg-accent/50' : ''}`}
          >
            {localeName}
            {locale === localeKey && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
