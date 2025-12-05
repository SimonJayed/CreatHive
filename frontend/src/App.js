import React from "react";
import { PopupProvider } from "./context/PopupContext";
import Popup from "./components/common/Popup";
import MainContent from "./components/MainContent";
import './App.css';

function App() {
  return (
    <PopupProvider>
      <Popup />
      <MainContent />
    </PopupProvider>
  );
}

export default App;
