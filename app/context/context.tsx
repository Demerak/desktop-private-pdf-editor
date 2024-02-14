'use client'
import React, { createContext, useState, ReactNode } from "react";

interface IMessageContext {
  message: string | undefined;
  setMessage: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export const MessageContext = createContext<IMessageContext | null>(null);

interface Props {
  children: ReactNode;
}

function Context({ children }: Props): JSX.Element {
  const [message, setMessage] = useState<string | undefined>();

  return (
    <MessageContext.Provider value={{ message, setMessage }}>
      {children}
    </MessageContext.Provider>
  );
}

export default Context;
