import React, { useRef, useEffect } from 'react';
import { useTerminal } from './useTerminal.jsx';
import { Terminal as TerminalIcon } from 'lucide-react';

const Terminal = () => {
  const { 
    output, 
    input, 
    handleInputChange, 
    handleInputSubmit, 
    isBooting, 
    currentDirectory 
  } = useTerminal();
  
  const inputRef = useRef(null);
  const outputEndRef = useRef(null);

  // Focus the input field when the component loads or the output updates
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    // Scroll to the bottom of the output when new content is added
    if (outputEndRef.current) {
      outputEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [output, isBooting]);

  return (
  <div 
    className="w-full h-[60vh] md:h-[70vh] rounded-lg shadow-2xl 
               bg-terminal-bg text-terminal-text overflow-hidden font-mono
               border-2 border-pcb-green-dark"
    onClick={() => inputRef.current?.focus()}
  >
    {/* Terminal Output Area */}
    <div className="h-full p-4 overflow-y-auto text-sm 
                    scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
    >
        {output.map((line, index) => (
          <div 
               key={index} 
               dangerouslySetInnerHTML={{ __html: line || '&nbsp;' }} // Fallback to non-breaking space
               className={line && typeof line === 'string' && line.includes('ERROR') ? 'text-red-500' : ''} 
          />
        ))}
        <div ref={outputEndRef} />
        
        {/* Terminal Input Line */}
        {!isBooting && (
          <div className="flex items-center pt-1">
            <span className="text-pcb-green-light pr-1">
              <TerminalIcon className="w-4 h-4 inline mr-1" />
              {currentDirectory} $
            </span>
            <form onSubmit={handleInputSubmit} className="flex-grow">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={handleInputChange}
                className="w-full bg-transparent border-none outline-none text-gray-100 pl-1 caret-pcb-green-light"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                disabled={isBooting}
              />
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Terminal;