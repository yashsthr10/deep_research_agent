import arrow from "../arrow.jpg";
import { useContext, useEffect } from "react";
import { AppContext } from "../context";

function InputBox() {
  const {
    messages,
    setMessages,
    inputValue,
    setInputValue,
    setMetadata,
    socketRef,
    logsContainerRef,
    isConnected,
    setIsConnected,
    Research,
    setResearch,
    ShowLogs,
    setShowLogs,
    showPanel,
    setShowPanel,
  } = useContext(AppContext);

  function smoothScrollToBottom() {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTo({
        top: logsContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }

  useEffect(() => {
    // Create WebSocket connection
    // socketRef.current = new WebSocket("ws://localhost:8000/ws/research"); (for local testing)
    const protocol = window.location.protocol === "https:" ? "wss://" : "ws://";
    socketRef.current = new WebSocket(
      `${protocol}${window.location.host}/ws/research`
    ); // for cloud deployment

    // on connecting to the fastapi websocket endpoint , logging and send the input reseach topic 
    socketRef.current.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
      if (inputValue) {
        socketRef.current.send(inputValue);
      }
    };

    // logging for debugging and streaming the response metadata and then updating the Research State 
    socketRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "stream") {
          // Append to existing messages
          if (data.content && data.content.report) {
            // Update report state
            console.log(data.content.report.response);
            setResearch(data.content.report.response);
          }

          setMessages((prev) => [...prev, data.content]);
          setTimeout(() => smoothScrollToBottom(), 100);
        } else if (data.type === "metadata") {
          console.log("Metadata received:", data.content);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    socketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsConnected(false);
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
    };

    // Cleanup on unmount
    return () => {
      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        socketRef.current.close();
      }
    };
  }, [inputValue]); // Only reconnect when inputValue changes

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop =
        logsContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // handling the empty input condition and reseting the states
  const passing_the_message = () => {
    const topic = document.getElementById("topic_input").value;
    if (!topic.trim()) {
      alert("Input is empty, Please type *something*");
      return;
    }
    setResearch(null);
    setMessages([]);
    setInputValue(topic);
    setShowPanel(true);
    document.getElementById("topic_input").value = "";
  };

  return (
    <div>
      <div className="topic_input">
        <input
          type="text"
          id="topic_input"
          name="topic"
          placeholder="Enter your topic..."
        />
        <div className="btn" onClick={passing_the_message}>
          <img src={arrow} alt="→" />
        </div>
      </div>
    </div>
  );
}

export default InputBox;
