import React, { useState, useEffect } from 'react';
import { Menu, RotateCcw, Bot, Delete, Calculator as CalcIcon } from 'lucide-react';
import Button from './components/Button';
import HistoryPanel from './components/HistoryPanel';
import AIChatPanel from './components/AIChatPanel';
import { evaluateExpression, formatDisplay } from './utils/mathUtils';
import { HistoryItem, CalculatorMode } from './types';
import { explainCalculation } from './services/geminiService';

const App: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [mode, setMode] = useState<CalculatorMode>(CalculatorMode.STANDARD);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [aiInitialQuery, setAiInitialQuery] = useState<string>('');

  // Handle number/operator input
  const handleInput = (val: string) => {
    if (result && result !== "Error" && !['+', '-', '×', '÷', '%', '^'].includes(val)) {
      // New calculation starting after a result
      setInput(val);
      setResult('');
    } else if (result && result !== "Error" && ['+', '-', '×', '÷', '%', '^'].includes(val)) {
      // Continue calculation with previous result
      setInput(result + val);
      setResult('');
    } else {
      setInput((prev) => prev + val);
    }
  };

  const handleClear = () => {
    setInput('');
    setResult('');
  };

  const handleDelete = () => {
    setInput((prev) => prev.slice(0, -1));
  };

  const handleEqual = () => {
    if (!input) return;
    
    const evalResult = evaluateExpression(input);
    setResult(evalResult);

    if (evalResult !== "Error") {
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        expression: input,
        result: evalResult,
        timestamp: Date.now()
      };
      setHistory((prev) => [newItem, ...prev].slice(0, 50)); // Keep last 50
    }
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setInput(item.expression);
    setResult(item.result);
    setIsHistoryOpen(false);
  };

  const handleExplain = async () => {
    if (!input || !result) return;
    setAiInitialQuery(`Explain how to calculate: ${input} which equals ${result}`);
    setIsAIOpen(true);
  };

  // Scientific functions wrapper
  const handleFunc = (func: string) => {
    setInput(prev => prev + func + '(');
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 md:p-8">
      {/* Main Container */}
      <div className="relative w-full max-w-sm md:max-w-4xl bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-800 flex flex-col md:flex-row h-[90vh] md:h-auto md:min-h-[600px]">
        
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
            <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-3xl"></div>
            <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-3xl"></div>
        </div>

        {/* History Panel (Mobile Overlay / Desktop Sidebar) */}
        <HistoryPanel 
          history={history} 
          onSelect={handleHistorySelect} 
          onClear={() => setHistory([])}
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
        />

        {/* Calculator Main Area */}
        <div className="flex-1 flex flex-col relative z-10 w-full md:w-auto">
          
          {/* Top Bar */}
          <div className="flex justify-between items-center p-4 pb-0">
            <button onClick={() => setIsHistoryOpen(!isHistoryOpen)} className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors">
              <Menu size={24} />
            </button>
            <div className="flex gap-1 bg-gray-800/50 p-1 rounded-full">
               <button 
                  onClick={() => setMode(CalculatorMode.STANDARD)}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${mode === CalculatorMode.STANDARD ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
               >
                 Standard
               </button>
               <button 
                  onClick={() => setMode(CalculatorMode.SCIENTIFIC)}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${mode === CalculatorMode.SCIENTIFIC ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
               >
                 Scientific
               </button>
            </div>
          </div>

          {/* Display */}
          <div className="flex-1 flex flex-col justify-end p-6 md:p-8 space-y-2 break-all">
            <div className="text-right text-gray-400 text-lg md:text-xl min-h-[1.5rem] tracking-wide font-light">
              {input || "0"}
            </div>
            <div className="text-right text-4xl md:text-6xl font-bold text-white tracking-tight">
               {formatDisplay(result || (input ? "" : "0"))}
            </div>
          </div>

          {/* Actions Bar (AI & Edit) */}
          <div className="px-6 pb-2 flex justify-between items-center">
             <button 
               onClick={handleExplain}
               className="flex items-center gap-2 text-xs font-medium text-indigo-300 hover:text-indigo-200 bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-lg transition-colors"
               disabled={!result}
             >
               <Bot size={14} /> Explain with AI
             </button>
             <button 
                onClick={() => setIsAIOpen(true)}
                className="md:hidden flex items-center gap-2 text-xs font-medium text-purple-300 bg-purple-500/10 px-3 py-1.5 rounded-lg"
             >
                Chat
             </button>
          </div>

          {/* Keypad */}
          <div className="bg-gray-900/80 backdrop-blur-md p-4 md:p-6 rounded-t-3xl border-t border-gray-800">
             <div className={`grid gap-3 transition-all ${mode === CalculatorMode.SCIENTIFIC ? 'grid-cols-5' : 'grid-cols-4'}`}>
                
                {mode === CalculatorMode.SCIENTIFIC && (
                  <>
                    <Button label="sin" variant="scientific" onClick={() => handleFunc('sin')} />
                    <Button label="cos" variant="scientific" onClick={() => handleFunc('cos')} />
                    <Button label="tan" variant="scientific" onClick={() => handleFunc('tan')} />
                    <Button label="log" variant="scientific" onClick={() => handleFunc('log')} />
                    <Button label="ln" variant="scientific" onClick={() => handleFunc('ln')} />
                    <Button label="(" variant="scientific" onClick={() => handleInput('(')} />
                    <Button label=")" variant="scientific" onClick={() => handleInput(')')} />
                    <Button label="^" variant="scientific" onClick={() => handleInput('^')} />
                    <Button label="√" variant="scientific" onClick={() => handleFunc('√')} />
                    <Button label="π" variant="scientific" onClick={() => handleInput('π')} />
                  </>
                )}

                <Button label="AC" variant="action" onClick={handleClear} />
                <Button label={<Delete size={20} />} variant="action" onClick={handleDelete} />
                <Button label="%" variant="action" onClick={() => handleInput('%')} />
                <Button label="÷" variant="operator" onClick={() => handleInput('÷')} />

                <Button label="7" onClick={() => handleInput('7')} />
                <Button label="8" onClick={() => handleInput('8')} />
                <Button label="9" onClick={() => handleInput('9')} />
                <Button label="×" variant="operator" onClick={() => handleInput('×')} />

                <Button label="4" onClick={() => handleInput('4')} />
                <Button label="5" onClick={() => handleInput('5')} />
                <Button label="6" onClick={() => handleInput('6')} />
                <Button label="−" variant="operator" onClick={() => handleInput('−')} />

                <Button label="1" onClick={() => handleInput('1')} />
                <Button label="2" onClick={() => handleInput('2')} />
                <Button label="3" onClick={() => handleInput('3')} />
                <Button label="+" variant="operator" onClick={() => handleInput('+')} />

                <Button label="0" onClick={() => handleInput('0')} doubleWidth />
                <Button label="." onClick={() => handleInput('.')} />
                <Button label="=" variant="operator" className="bg-gradient-to-r from-indigo-600 to-purple-600 border-none" onClick={handleEqual} />
             </div>
          </div>
        </div>

        {/* AI Chat Side Panel (Desktop) / Modal (Mobile) */}
        <div className={`
           md:w-[400px] md:border-l md:border-gray-800 relative bg-gray-950
           ${isAIOpen ? 'block' : 'hidden md:block'}
           md:flex md:flex-col
        `}>
           <AIChatPanel 
             isOpen={isAIOpen || window.innerWidth >= 768} 
             onClose={() => setIsAIOpen(false)}
             initialQuery={aiInitialQuery}
           />
           
           {/* Placeholder for desktop when not active - or we keep it always active on desktop */}
           {!isAIOpen && window.innerWidth >= 768 && (
             <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mb-4 shadow-xl">
                  <Bot className="text-indigo-400" size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Gemini AI Assistant</h3>
                <p className="text-gray-400 text-sm mb-6">Need help with a complex problem? I can solve word problems and explain the math.</p>
                <button 
                  onClick={() => setIsAIOpen(true)}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-indigo-900/20"
                >
                  Activate AI Assistant
                </button>
             </div>
           )}
        </div>

      </div>
    </div>
  );
};

export default App;