import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';

function IncomeWidget({ onRemove }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative h-full flex flex-col">
      {/* Three-dot settings button */}
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 no-drag"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          setSettingsOpen(!settingsOpen);
        }}
      >
        <MoreVertical size={20} />
      </button>

      {/* Widget Content */}
      <div className="mt-6 px-2 flex-grow overflow-hidden">
        <h3 className="font-semibold">Income</h3>
        <div className="mt-2 overflow-hidden">
          <p className="text-sm text-gray-600 truncate">
            Your income data goes here...
          </p>
        </div>
      </div>

      {/* Settings Popup */}
      {settingsOpen && (
        <div
          ref={settingsRef}
          className="absolute top-8 right-2 bg-white shadow-lg rounded border w-48 z-10"
        >
          <div className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer">
            Edit Widget
          </div>
          <div className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer">
            Refresh Data
          </div>
          <div
            className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer text-red-500"
            onClick={onRemove} // <-- Important logic here
          >
            Remove Widget
          </div>
        </div>
      )}
    </div>
  );
}

export default IncomeWidget;
