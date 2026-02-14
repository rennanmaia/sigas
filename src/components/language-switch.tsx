import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Globe, Check } from 'lucide-react';

export function LanguageSwitch() {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'pt-BR', label: 'Português (Brasil)', nativeLabel: 'Português' },
    { code: 'en-US', label: 'English (United States)', nativeLabel: 'English' },
  ];

  const currentLang = languages.find(lang => lang.code === i18n.language);
  
  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    // Ensure localStorage is updated
    localStorage.setItem('i18nLanguage', code);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          title={`Change language - Current: ${currentLang?.nativeLabel || i18n.language}`}
        >
          <Globe className="h-4 w-4" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {languages.map((lang) => {
          const isSelected = i18n.language === lang.code;
          return (
            <DropdownMenuCheckboxItem
              key={lang.code}
              checked={isSelected}
              onCheckedChange={() => handleLanguageChange(lang.code)}
              className="cursor-pointer"
            >
              <div className="flex items-center gap-2 flex-1">
                <span>{lang.label}</span>
                {isSelected && (
                  <Check className="h-4 w-4 ml-auto text-primary" />
                )}
              </div>
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
