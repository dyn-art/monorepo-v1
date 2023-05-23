import { clsx } from 'clsx';
import React from 'react';
import { Link } from 'react-router-dom';
import { TOnSelectFrameEvent } from '../../shared';
import { copyToClipboard } from '../core';
import { TUIHandler, uiHandler } from '../ui-handler';

const Home: React.FC = () => {
  const [selectedFrames, setSelectedFrames] = React.useState<
    TOnSelectFrameEvent['args']['selected'] | null
  >(null);
  const [
    isLoadingIntermediateFormatExport,
    setIsLoadingIntermediateFormatExport,
  ] = React.useState(false);

  React.useEffect(() => {
    uiHandler.registerEvent({
      type: 'figma.message',
      key: 'on-select-frame-event',
      callback: async (instance: TUIHandler, args) => {
        console.log('onselect', { args });
        if (args.selected != null && args.selected.length > 0) {
          setSelectedFrames(args.selected);
        } else {
          setSelectedFrames(null);
        }
      },
    });

    uiHandler.registerEvent({
      type: 'figma.message',
      key: 'intermediate-format-export-result-event',
      callback: async (instance: TUIHandler, args) => {
        setIsLoadingIntermediateFormatExport(false);
        if (args.type === 'success') {
          copyToClipboard(args.content);
        }
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
        <li
          className={clsx({
            disabled:
              selectedFrames == null ||
              selectedFrames.length === 0 ||
              isLoadingIntermediateFormatExport,
          })}
        >
          {/* TODO: proper loading indicator */}
          {isLoadingIntermediateFormatExport ? (
            <div>Loading...</div>
          ) : (
            <div
              onClick={() => {
                if (selectedFrames != null) {
                  setIsLoadingIntermediateFormatExport(true);
                  uiHandler.postMessage('intermediate-format-export-event', {
                    selectedElements: selectedFrames,
                    config: {
                      svgExportIdentifierRegex: '_svg$',
                      frameToSVG: false,
                    },
                  });
                }
              }}
            >
              Export Frame
              {selectedFrames != null && selectedFrames.length > 0
                ? ` [${selectedFrames[0].name}] (${selectedFrames.length})`
                : ''}
            </div>
          )}
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
