import { useEffect, useState } from 'react';

const Loader = () => {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowText(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className='flex flex-col items-center justify-center h-screen w-screen' role="status" aria-live="polite">
      <div className='relative'>
        <div className='w-16 h-16 border-[3px] border-muted rounded-full animate-spin'></div>
        <div className='w-16 h-16 border-[3px] border-primary rounded-full animate-spin absolute top-0 left-0 border-t-transparent'></div>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
          <div className='w-6 h-6 bg-primary rounded-full animate-pulse opacity-60'></div>
        </div>
      </div>
      <div
        className={`mt-4 text-muted-foreground text-sm font-medium tracking-wide transition-opacity duration-300 ${
          showText ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <span className="sr-only">Loading</span>
        Loading...
      </div>
    </div>
  );
};

export default Loader;
