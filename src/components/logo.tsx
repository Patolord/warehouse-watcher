import React from 'react';
import { Atom } from 'lucide-react';

const WarehouseWatcherLogo = () => {
  return (
    <div className="flex gap-2 items-stretch h-12">
      <div className="relative mr-1">
        <div className="w-12 h-full bg-black transform -skew-x-12"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Atom className="text-white" size={32} />
        </div>
      </div>
      <div className="relative flex-grow">
        <div className="absolute -left-2 top-0 w-[calc(100%+1rem)] h-full bg-blue-600 transform -skew-x-12"></div>
        <div className="relative px-3 py-1 flex flex-col justify-center">
          <span className="text-white font-bold text-lg block leading-tight">WAREHOUSE</span>
          <div className="flex items-center gap-2">
            <div className="flex-grow h-px bg-white"></div>
            <span className="text-white text-[10px] whitespace-nowrap">WATCHER</span>
            <div className="flex-grow h-px bg-white"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarehouseWatcherLogo;