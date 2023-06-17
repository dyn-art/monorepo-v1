import React from 'react';

import { LOG_LEVEL, Logger } from '@pda/logger';

export const logger = new Logger({
  prefix: 'usePreview',
  level: LOG_LEVEL.INFO,
});

export function usePreview(inFigma: boolean) {
  const [isConnected, setIsConnected] = React.useState<boolean>(false);
  const ws = React.useRef<WebSocket | null>(null);

  // Register window message event listener
  React.useEffect(() => {
    // Helper method to handle window messages
    const onWindowMsg = (event: MessageEvent) => {
      const eventData = event.data;
      // Handle figma plugin message
      if (eventData?.pluginMessage != null && eventData?.inFigma !== inFigma) {
        logger.info('On window message event', {
          pluginMessage: eventData.pluginMessage,
          eventData,
          inFigma,
        });

        // Check if the websocket is open before sending a message
        if (ws.current?.readyState === 1) {
          ws.current.send(JSON.stringify(eventData.pluginMessage));
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
    if (inFigma) {
      window.addEventListener('message', onWindowMsg);
    } else {
      window.parent.addEventListener('message', onWindowMsg);
    }

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
            const pluginMessage = JSON.parse(
              String.fromCharCode(...rawData.data)
            );
            logger.info('On socket message event', {
              pluginMessage,
              eventData: rawData,
              inFigma,
            });
            if (inFigma) {
              window.parent.postMessage(
                { pluginMessage: pluginMessage, inFigma },
                '*'
              );
            } else {
              window.postMessage(
                { pluginMessage: pluginMessage, inFigma },
                '*'
              );
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
