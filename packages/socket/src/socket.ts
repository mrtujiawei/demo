const protocol = location.protocol == 'https:' ? 'wss' : 'ws';
const host = location.host;
// const host = 'localhost:4444';

const webSocketUrl = `${protocol}://${host}`;

const eventTypes = ['open', 'close', 'message', 'error'] as const;

export type Callback = (message: {
  type: keyof WebSocketEventMap;
  event: Event;
}) => void;

export const createWebSocket = (callback: Callback) => {
  const ws = new WebSocket(webSocketUrl);
  const eventHandlers = eventTypes.map((eventType) => {
    return {
      eventType,
      callback(event: Event) {
        callback({
          type: eventType,
          event,
        });
      },
    };
  });

  eventHandlers.forEach((handler) => {
    ws.addEventListener(handler.eventType, handler.callback);
  });

  const close = () => {
    eventHandlers.forEach((handler) => {
      ws.removeEventListener(handler.eventType, handler.callback);
    });
    ws.close();
  };

  return {
    ws,
    close,
  };
};
