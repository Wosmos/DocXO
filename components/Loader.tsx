import { useEffect, useState } from 'react';

const Loader = () => {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowText(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className='flex flex-col items-center justify-center h-screen w-screen'>
      <div className='relative'>
        <div className='w-20 h-20 border-4 border-blue-200 rounded-full animate-spin'></div>
        <div className='w-20 h-20 border-4 border-blue-500 rounded-full animate-spin absolute top-0 left-0 border-t-transparent'></div>
        <div className='w-20 h-20 border-4 border-blue-800 rounded-full animate-spin absolute top-0 left-0 border-l-transparent border-r-transparent'></div>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
          <div className='w-10 h-10 bg-white rounded-full animate-pulse'></div>
        </div>
      </div>
      <div
        className={`mt-4 text-white text-xl font-bold tracking-wider ${
          showText ? 'animate-fade-in' : 'opacity-0'
        }`}
      >
        Loading...
      </div>
    </div>
  );
};

export default Loader;
