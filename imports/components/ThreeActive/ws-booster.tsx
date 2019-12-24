import { useEffect, useState, createContext, useContext, useRef } from "react";

const ws = new WebSocket('ws://threeactive-ws-booster.herokuapp.com');

export const A_ON_LOCATION_UPDATE = 'lu';
export const A_PING = 'p';

export interface WBPackage {
  a: string,
  p?: any
}

interface WBContext {
  ws: WebSocket,
  isOpen: Boolean,
  message: string,
  error: Error,
  isBroadcast: Boolean,
}
export const wsBoosterContext = createContext<WBContext>(null);

export function useWsBooster() {
  return useContext(wsBoosterContext);
}

export default function WsBooster(props) {
  const { children } = props;
  const [message, setMessage] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  // const [send, setSend] = useState((...args) => {});
  const [error, setError] = useState(null);

  const [isBroadcast, setIsbroadcast] = useState(false);
  const isBroadcastRef = useRef(false);
  const [pendulum, setPendulum] = useState(false);
  const pendulumRef = useRef(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      pendulumRef.current = !pendulumRef.current;
      setPendulum(pendulumRef.current);
    }, 500);
  
    return () => {
      clearInterval(intervalId);
    }
  }, []);

  useEffect(() => {
    if (isBroadcastRef.current) {
      if (!isBroadcast) setIsbroadcast(true);
      isBroadcastRef.current = false;
      setTimeout(() => {
        if (!isBroadcastRef.current) setIsbroadcast(false);
      }, 300);
    }
  }, [pendulum]);
  
  useEffect(() => {
    ws.onopen = function () {
      setIsOpen(true);
    }
    ws.onclose = function () {
      setIsOpen(false);
    }
    ws.onmessage = function (event) {
      try {
        const wbPackage: WBPackage = JSON.parse(event.data);
        if (wbPackage.a === A_ON_LOCATION_UPDATE) {
          isBroadcastRef.current = true;
        }
        setMessage(event.data);
      } catch (e) {
        // 
      }
    }
    ws.onerror = function(error) {
      setError(error)
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      // setSend(ws.send);
    } else {
      // setSend((...args) => {});
    }
  }, [isOpen])

  return (
    <wsBoosterContext.Provider
      value={{
        ws,
        isOpen,
        message,
        // send,
        error,
        isBroadcast,
      }}
      children={children}
    />
  );
}
