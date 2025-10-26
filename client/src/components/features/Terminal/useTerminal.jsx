import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const BOOT_SEQUENCE = [
  "Initializing MERN_KERNEL (v1.0.1)...",
  "Loading subsystems: (Express, Mongoose, Gemini)... OK",
  "Checking Hardware Modules (IoT, Embedded, EdgeAI)... PASSED",
  "Fetching public content index (3 Projects, 1 Blog Post)... DONE",
  "Starting Terminal Emulation Service...",
  "",
  "<span class='text-pcb-green-light'>Welcome to Arpit's Portfolio System.</span>",
  "Type <span class='text-yellow-400'>'help'</span> for a list of available commands.",
  ""
];

const INITIAL_OUTPUT = [
    "&nbsp;",
    "<span class='text-pcb-green-light'>* * * System Booting * * *</span>"
];

export const useTerminal = () => {
  const [output, setOutput] = useState(INITIAL_OUTPUT);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isBooting, setIsBooting] = useState(true);
  const [currentDirectory, setCurrentDirectory] = useState('portfolio_os');
  const navigate = useNavigate();

  // --- Boot Sequence Effect ---
  useEffect(() => {
    if (isBooting) {
      let lineIndex = 0;
      const interval = setInterval(() => {
        if (lineIndex < BOOT_SEQUENCE.length) {
          setOutput(prev => [...prev, BOOT_SEQUENCE[lineIndex]]);
          lineIndex++;
        } else {
          clearInterval(interval);
          setIsBooting(false);
        }
      }, 100); // Speed of the boot sequence

      return () => clearInterval(interval);
    }
  }, [isBooting]);

  // --- Command Handlers ---
  const commands = useCallback((command, args) => {
    const [cmd, ...cmdArgs] = command.trim().toLowerCase().split(/\s+/);

    switch (cmd) {
      case 'help':
        return [
          "<span class='text-yellow-400'>Available Commands:</span>",
          "&nbsp;",
          "<span class='text-cyan-400'>projects</span>: List and view all showcase projects.",
          "<span class='text-cyan-400'>about</span>: Display skills, education, and expertise.",
          "<span class='text-cyan-400'>blog</span>: View technical articles and insights.",
          "<span class='text-cyan-400'>contact</span>: Show contact information and links.",
          "<span class='text-cyan-400'>clear</span>: Clear the terminal screen.",
          "<span class='text-cyan-400'>nav &lt;path&gt;</span>: Navigate to a specific path (e.g., 'nav /projects').",
          "<span class='text-cyan-400'>echo &lt;text&gt;</span>: Display a line of text.",
          "&nbsp;"
        ];
      case 'projects':
        navigate('/projects');
        return ["Navigating to /projects..."];
      case 'about':
        navigate('/about');
        return ["Navigating to /about..."];
      case 'blog':
        navigate('/blog');
        return ["Navigating to /blog..."];
      case 'contact':
        return [
            "<span class='text-yellow-400'>[ arpit.dev ] Contact Info:</span>",
            "&nbsp;",
            "Email: <a href='mailto:your.email@example.com' class='text-pcb-green-light hover:underline'>your.email@example.com</a>",
            "GitHub: <a href='https://github.com/yourusername' target='_blank' rel='noopener noreferrer' class='text-pcb-green-light hover:underline'>https://github.com/yourusername</a>",
            "LinkedIn: <a href='https://linkedin.com/in/yourusername' target='_blank' rel='noopener noreferrer' class='text-pcb-green-light hover:underline'>https://linkedin.com/in/yourusername</a>",
            "&nbsp;"
        ];
      case 'clear':
        return []; 
      case 'nav':
        if (cmdArgs.length > 0) {
            const path = cmdArgs[0].startsWith('/') ? cmdArgs[0] : `/${cmdArgs[0]}`;
            navigate(path);
            return [`Navigating to ${path}...`];
        }
        return ["<span class='text-red-500'>ERROR:</span> Usage: nav &lt;path&gt;"];
      case 'echo':
        return [cmdArgs.join(' ')];
      default:
        return [`<span class='text-red-500'>ERROR:</span> Command not found: ${cmd}. Type 'help'.`];
    }
  }, [navigate]);

  // --- Input Handlers ---
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleInputSubmit = (e) => {
    e.preventDefault();
    if (isBooting || input.trim() === '') return;

    const command = input.trim();
    
    // 1. Add command to output and history
    setOutput(prev => [...prev, `<span class='text-pcb-green-light'>${currentDirectory} $</span> ${command}`]);
    setHistory(prev => [command, ...prev]);
    setHistoryIndex(-1); // Reset history index

    // 2. Process command
    const response = commands(command);
    
    // 3. Update output based on command response
    if (command.toLowerCase().trim() === 'clear') {
        setOutput([]);
    } else {
        setOutput(prev => [...prev, ...response]);
    }
    
    setInput('');
  };

  return {
    output,
    input,
    handleInputChange,
    handleInputSubmit,
    isBooting,
    currentDirectory,
  };
};