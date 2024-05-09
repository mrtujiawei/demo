import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import './App.css';
import Message from './Message';
import { Callback, createWebSocket } from './socket';
import { createFileMessage, createTextMessage, parseMessage } from './utils';

const App = () => {
  const listContainer = useRef<HTMLUListElement>(null);
  const textInput = useRef<HTMLInputElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const [messageList, setMessageList] = useState<Message[]>([]);
  const ws = useRef<ReturnType<typeof createWebSocket> | null>(null);

  const sendMessage = async () => {
    const content = textInput.current?.value;
    if (!content) {
      return;
    }
    ws.current?.ws.send(await createTextMessage(content));
    textInput.current!.value = '';
  };

  useEffect(() => {
    let reconnectCount = 0;
    let connect = false;
    const onMessage = (message: Message) => {
      setMessageList((messageList) => messageList.concat(message));
    };

    const callback: Callback = async ({ type, event }) => {
      console.log(`Socket ${type}`, event);
      if (type == 'open') {
        connect = true;
        reconnectCount = 0;
        onMessage(new Message(0, '连接成功'));
      } else if (type == 'error') {
        if (connect) {
          onMessage(new Message(0, '连接错误'));
        } else {
          onMessage(new Message(0, '连接失败'));
        }
      } else if (type == 'message') {
        const data = (event as MessageEvent).data as Blob;
        const result = await parseMessage(data);
        if (result.type == 'text') {
          onMessage(new Message(1, result.content as string));
        } else if (result.type == 'file') {
          const { fileType, name } = result.metadata;
          const message = new Message(2, `${name}`);
          message.setArrayBuffer(result.content as ArrayBuffer);
          message.setFileType(fileType);
          onMessage(message);
        }
      } else if (type == 'close') {
        connect = false;
        if (connect) {
          onMessage(new Message(0, '连接已关闭'));
        }
        setTimeout(() => {
          onMessage(new Message(0, '正在重试中...'));
          ws.current?.close();
          ws.current = createWebSocket(callback);
        }, reconnectCount++ * 1000);
      } else {
        // 不可能出现未知的type
      }
    };

    ws.current = createWebSocket(callback);

    return () => {
      ws.current?.close();
    };
  }, []);

  useLayoutEffect(() => {
    if (messageList.length == 0) {
      return;
    }
    const container = listContainer.current!;
    const delta = 60;
    if (
      container.clientHeight + container.scrollTop + delta >
      container.scrollHeight
    ) {
      container.scrollBy({
        top: Number.MAX_SAFE_INTEGER,
        behavior: 'smooth',
      });
    }
  }, [messageList]);

  return (
    <div id="app">
      <ul className="messages" ref={listContainer}>
        {messageList.map((item, index) => (
          <li key={index} className={`message ${item.getClassName()}`}>
            {item.time.toLocaleTimeString()}:{' '}
            {item.code == 2 ? (
              <>
                <a
                  href={URL.createObjectURL(
                    new Blob([item.arrayBuffer], {
                      type: item.fileType,
                    })
                  )}
                  download={item.message}
                >
                  {item.message}
                </a>
              </>
            ) : (
              item.message
            )}
          </li>
        ))}
      </ul>
      <div className="toolbar">
        <input
          type="text"
          className="input"
          ref={textInput}
          onKeyUp={(event) => {
            if (event.key == 'Enter') {
              sendMessage();
            }
          }}
        />
        <input
          ref={fileInput}
          type="file"
          style={{
            display: 'none',
          }}
          value=""
          onChange={async (event) => {
            const file = event.target.files![0];
            ws.current?.ws.send(await createFileMessage(file));
          }}
        />
        <button className="send-btn" onClick={sendMessage}>
          发送
        </button>
        <button
          className="send-btn"
          onClick={() => {
            fileInput.current?.click();
          }}
        >
          文件
        </button>
      </div>
    </div>
  );
};

export default App;
