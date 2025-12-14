import React from 'react';
import { HistoryItem } from '../types';
import { Trash2, Clock, BrainCircuit } from 'lucide-react';

interface HistoryPanelProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelect, onClear, isOpen, onClose }) => {
  return (
    <div 
      className={`absolute inset-y-0 left-0 w-80 bg-gray-900/95 backdrop-blur-xl border-r border-gray-800 transform transition-transform duration-300 z-30 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div className="p-4 border-b border-gray-800 flex justify-between items-center">
        <h2 className="text-lg font-semibold flex items-center gap-2 text-white">
          <Clock size={18} /> History
        </h2>
        {history.length > 0 && (
          <button 
            onClick={onClear}
            className="text-gray-400 hover:text-red-400 p-2 rounded-full hover:bg-gray-800 transition-colors"
            title="Clear History"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {history.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <p>No history yet.</p>
            <p className="text-sm mt-2">Calculations will appear here.</p>
          </div>
        ) : (
          history.map((item) => (
            <div 
              key={item.id}
              onClick={() => onSelect(item)}
              className="group p-3 rounded-xl bg-gray-800/50 hover:bg-gray-800 border border-transparent hover:border-gray-700 cursor-pointer transition-all"
            >
              <div className="text-gray-400 text-sm mb-1 flex items-center justify-between">
                <span>{item.expression}</span>
                {item.isAi && <BrainCircuit size={14} className="text-purple-400" />}
              </div>
              <div className="text-xl text-white font-medium text-right">= {item.result}</div>
            </div>
          ))
        )}
      </div>
      
      {/* Mobile close button overlay */}
      <button 
        className="md:hidden absolute top-4 right-4 p-2 text-white"
        onClick={onClose}
      >
        ✕
      </button>
    </div>
  );
};

export default HistoryPanel;