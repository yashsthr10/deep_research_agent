import './App.css';
import ShowProcessing from './components/ShowProcessing';
import InputBox from './components/InputBox';
import { AppContext } from "./context";
import { useContext } from 'react';

function App() {
  const { messages, setMessages, inputValue, setInputValue, showPanel, setShowPanel } = useContext(AppContext);
  return (
    <div className="app">
      {!showPanel &&
      <h1 className="lazy-heading">just type stuff, i'll research it.</h1>
     }
     {showPanel && 
     <ShowProcessing/>
     }
       <InputBox/>
    </div>
    

  );
}

export default App;
