import { createContext, useState, useRef } from "react";

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [showPanel, setShowPanel] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [metadata, setMetadata] = useState(null);
  const socketRef = useRef(null);
  const logsContainerRef = useRef(null);
  const [ShowLogs, setShowLogs] = useState(true);
  const [Research, setResearch] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  return (
    <AppContext.Provider value={{
      messages,
      setMessages,
      showPanel,
      setShowPanel,
      inputValue,
      setInputValue,
      metadata,
      setMetadata,
      ShowLogs, setShowLogs,
      Research, setResearch,
      isConnected, setIsConnected,
      socketRef,
      logsContainerRef
    }}>
      {children}
    </AppContext.Provider>
  );
}
