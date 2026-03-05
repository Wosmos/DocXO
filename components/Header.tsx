import { cn } from '@/lib/utils';
import Link from 'next/link';

const Header = ({ children, className }: HeaderProps) => {
  return (
    <header className={cn('header', className)} role="banner">
      <Link href='/' className='md:flex-1 flex items-center gap-2'>
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none" className="text-primary shrink-0" aria-hidden="true">
          <rect width="32" height="32" rx="8" fill="currentColor" />
          <path d="M8 12L12 8H20L24 12V20L20 24H12L8 20V12Z" fill="white" fillOpacity="0.9" />
          <path d="M13 14H19V15.5H13V14ZM13 17H17V18.5H13V17Z" fill="currentColor" />
        </svg>
        <span className='hidden md:block text-lg font-semibold tracking-tight text-foreground'>
          Wosmo
        </span>
      </Link>
      {children}
    </header>
  );
};

export default Header;
