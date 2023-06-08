import React from 'react';

export function usePreview(inFigma: boolean) {
  const [isConnected, setIsConnected] = React.useState<boolean>(false);
  const ws = React.useRef<WebSocket | null>(null);

  // Register window message event listener
  React.useEffect(() => {
    // Helper method to handle window messages
    const onWindowMsg = (event: MessageEvent) => {
      // Handle figma plugin message
      if (event.data.pluginMessage != null) {
        const message = JSON.stringify(event.data.pluginMessage);

        // Check if the websocket is open before sending a message
        if (ws.current?.readyState === 1) {
          ws.current.send(message);
        }
        // If the websocket is not open, try again after 1 second
        else {
          setTimeout(() => {
            onWindowMsg(event);
          }, 1000);
        }
      }
    };

    // Register message event listener
    window.addEventListener('message', onWindowMsg);

    // Return a cleanup function to stop listening for messages
    return () => {
      window.removeEventListener('message', onWindowMsg);
    };
  }, []);

  // Register websocket
  React.useEffect(() => {
    // Open websocket connection
    openWebsocket(
      (openWS) => {
        ws.current = openWS;
        setIsConnected(true);

        // When a message is received from the server, parse it and post it to the window
        openWS.onmessage = (event: MessageEvent) => {
          const message = JSON.parse(event.data);
          const rawData = message?.data;
          if (message?.type !== 'server.broadcast' || rawData == null) return;
          try {
            const data = JSON.parse(String.fromCharCode(...rawData.data));
            if (inFigma) {
              parent.postMessage({ pluginMessage: data }, '*');
            } else {
              window.postMessage({ pluginMessage: data }, '*');
            }
          } catch (error) {
            console.error('Error while processing message from server!', error);
          }
        };
      },
      () => setIsConnected(false)
    );

    // Return a cleanup function to close the websocket connection
    return () => {
      ws.current?.close();
    };
  }, []);

  return { isConnected };
}

function openWebsocket(
  onOpen: (ws: WebSocket) => void,
  onClose: (ws: WebSocket) => void
) {
  // Create a new WebSocket pointing to the preview server
  const ws = new WebSocket('ws://localhost:9001/ws');

  ws.onopen = () => {
    onOpen(ws);
  };

  // When the WebSocket connection is closed, try to reopen it after 3 seconds
  ws.onclose = () => {
    onClose(ws);
    setTimeout(() => openWebsocket(onOpen, onClose), 3000);
  };
}
