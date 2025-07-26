import { createContext, useContext, useState } from 'react';

const LiquidGlassContext = createContext();

export const useLiquidGlass = () => {
  const context = useContext(LiquidGlassContext);
  if (!context) {
    throw new Error('useLiquidGlass must be used within a LiquidGlassProvider');
  }
  return context;
};

export const LiquidGlassProvider = ({ children }) => {
  const [isEnabled, setIsEnabled] = useState(true);

  const toggle = () => setIsEnabled(!isEnabled);

  return (
    <LiquidGlassContext.Provider value={{ isEnabled, toggle }}>
      {children}
    </LiquidGlassContext.Provider>
  );
};