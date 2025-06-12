import "../App.css";
import { AppContext } from "../context";
import React, { useEffect, useRef, useState, useContext } from "react";

function ShowProcessing() {
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

  // logging Reseach for debugging
  console.log(Research);

  // formatting the report 
  const RawReport = ({ text }) => {
    const lines = text.split("\n");

    const formatLine = (line) => {
      const match = line.match(/^(\w+):\s*(.+)/);
      if (match) {
        return (
          <p className="report-line">
            <strong>{match[1]}:</strong> {match[2]}
          </p>
        );
      }
      return <p className="report-line">{line}</p>;
    };

    return (
      <div className="report-text">
        {lines.map((line, idx) => (
          <React.Fragment key={idx}>{formatLine(line)}</React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <>
      {Research && (
        <>
          <div className="report_page">
            <h1>Report: {inputValue}</h1>
            <RawReport text={Research} />
          </div>
        </>
      )}

      {Research == null && (
        <div className="show_processing">
          <h1>Researching: {inputValue}</h1>
          <div className="processing_box">
            <div className="connection-status">
              <div
                className={`status-indicator ${
                  isConnected ? "connected" : "connecting"
                }`}
              >
                {isConnected ? "● Connected" : "○ Connecting..."}
              </div>
            </div>
            <div className="logs" ref={logsContainerRef}>
              {messages.map((msg, idx) => (
                <div key={idx} className="log-entry">
                  {formatMessage(msg)}
                </div>
              ))}
            </div>

            {!isConnected && messages.length === 0 && (
              <div className="connection-message">
                Connecting to AI agent...
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// Helper to format different message types
function formatMessage(msg) {
  if (typeof msg === "string") {
    return <p>{msg}</p>;
  }

  // Handle object-based messages
  return (
    <div className="message-object">
      {Object.entries(msg).map(([key, value]) => (
        <div key={key}>
          <strong>{key}:</strong> {JSON.stringify(value, null, 2)}
        </div>
      ))}
    </div>
  );
}
export default ShowProcessing;
