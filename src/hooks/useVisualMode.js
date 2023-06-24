import { useState } from "react";

const useVisualMode = initialMode => {
  const [history, setHistory] = useState([initialMode]);

  const transition = (mode, replace = false) => {
    setHistory(prev =>
      replace ? [...prev.slice(0, -1), mode] : [...prev, mode]
    );
  };

  const back = () => {
    setHistory(prev => (prev.length > 1 ? prev.slice(0, -1) : prev));
  };

  return { mode: history[history.length - 1], transition, back };
};

export default useVisualMode;
