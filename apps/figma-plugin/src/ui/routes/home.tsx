import React from 'react';
import { Link } from 'react-router-dom';
import { TUIHandler, uiHandler } from '../ui-handler';

const Home: React.FC = () => {
  React.useEffect(() => {
    uiHandler.registerEvent({
      type: 'figma.message',
      key: 'on-select-frame-event',
      callback: async (instance: TUIHandler, event) => {
        console.log('on-select-frame Event', { event });
      },
    });
    uiHandler.registerEvent({
      type: 'click',
      key: 'click-event',
      callback: async (instance: TUIHandler, event) => {
        console.log('click Event', { event });
      },
    });
  }, []);

  return (
    <div className="m-4 space-y-4">
      <h1 className="text-2xl font-bold">physical.art plugin</h1>
      <ul className="menu bg-base-100 w-56 p-2 rounded-box">
        <li className="menu-title">
          <span>Plugins</span>
        </li>
        <li>
          <div
            onClick={() => {
              uiHandler.postMessage('intermediate-format-export-event', {
                selectedElement: 'test',
              });
            }}
          >
            Test
          </div>
        </li>
        <li className="menu-title">
          <span>Other</span>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
      </ul>
    </div>
  );
};

export default Home;
