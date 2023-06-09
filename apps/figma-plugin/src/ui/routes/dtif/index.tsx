import { TNode } from '@pda/dtif-types';
import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { TOnSelectFrameEvent, logger } from '../../../shared';
import { copyToClipboard } from '../../core';
import { TUIHandler, uiHandler } from '../../ui-handler';
import ExportPreview from './ExportPreview';
import './styles.css';

const DEFAULT_SELECT = 'default';

const DTIFExport: React.FC = () => {
  const [selectedFrames, setSelectedFrames] = React.useState<
    TOnSelectFrameEvent['args']['selected']
  >([]);
  const [selectedFrameName, setSelectedFrameName] = React.useState<
    string | null
  >(null);
  const [isExporting, setIsExporting] = React.useState(false);
  const [exportedNode, setExportedNode] = React.useState<TNode | null>(null);

  // ============================================================================
  // Lifecycle
  // ============================================================================

  // Register events
  React.useEffect(() => {
    // On select frame event
    uiHandler.registerEvent({
      type: 'figma.message',
      key: 'on-select-frame-event',
      callback: async (instance: TUIHandler, args) => {
        console.log('onselect', { args });
        if (args.selected != null && args.selected.length > 0) {
          setSelectedFrames(args.selected);
          setSelectedFrameName(args.selected[args.selected.length - 1].name);
        } else {
          setSelectedFrames([]);
          setSelectedFrameName(DEFAULT_SELECT);
        }
      },
    });

    // Intermediate format export result event
    uiHandler.registerEvent({
      type: 'figma.message',
      key: 'intermediate-format-export-result-event',
      callback: async (instance: TUIHandler, args) => {
        setIsExporting(false);
        if (args.type === 'success') {
          setExportedNode(args.content);
          logger.info('Export result', { args });
          copyToClipboard(JSON.stringify(args.content));
        }
      },
    });
  }, []);

  // ============================================================================
  // Callbacks
  // ============================================================================

  const onExport = useCallback(() => {
    if (selectedFrames != null) {
      setIsExporting(true);
      uiHandler.postMessage('intermediate-format-export-event', {
        selectedElements: selectedFrames,
        config: {
          svgExportIdentifierRegex: '_svg$',
          frameToSVG: false,
        },
      });
    }
  }, [selectedFrames]);

  const onFrameSelect = useCallback(
    (event: React.ChangeEventHandler<HTMLSelectElement> | undefined) => {
      const frameName = (event as any)?.target?.value;
      if (typeof frameName === 'string') {
        setSelectedFrameName(frameName);
      }
    },
    []
  );

  // ============================================================================
  // UI
  // ============================================================================

  return (
    <div className="mx-4 mb-4">
      {/* Breadcrumbs */}
      <div className="breadcrumbs text-sm">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>DTIF</li>
        </ul>
      </div>
      <div className="space-y-4">
        {/* Title */}
        <h1 className="text-2xl font-bold">Export Frame as DTIF</h1>

        {/* Select */}
        <div className="flex w-full flex-col bg-base-content px-6 py-4">
          <p className="mb-2 text-base-300">SELECT FRAME</p>
          <div className="form-control w-full max-w-xs">
            <select
              className="select-bordered select"
              disabled={isExporting}
              value={selectedFrameName ?? 'default'}
              onChange={onFrameSelect as any}
            >
              {selectedFrames.length > 0 ? (
                selectedFrames.map((frame) => (
                  <option
                    value={frame.name}
                    selected={selectedFrameName === frame.name}
                  >
                    {frame.name}
                  </option>
                ))
              ) : (
                <>
                  <option value={DEFAULT_SELECT} disabled>
                    Pick a frame in Figma editor
                  </option>
                  <option value={`${DEFAULT_SELECT}-info-1`} disabled>
                    Press <kbd className="kbd kbd-sm">CTRL</kbd> +{' '}
                    <kbd className="kbd kbd-sm">A</kbd> in the Figma editor to
                    select all.
                  </option>
                </>
              )}
            </select>
            <label className="label">
              <span className="label-text-alt text-primary-content">
                Select to export frame in Figma editor
              </span>
            </label>
          </div>

          <button
            className="btn-success btn-sm btn mt-1 w-20"
            onClick={onExport}
          >
            {isExporting ? (
              <span className="loading-spinner loading text-primary"></span>
            ) : (
              'EXPORT'
            )}
          </button>
        </div>

        {/* Preview */}
        {exportedNode != null && (
          <>
            <div className="divider pb-4 pt-4">EXPORTED TO</div>
            <div className="pb-2  text-sm font-bold">
              <a
                className="opacity-20 hover:opacity-60"
                onClick={() => {
                  // TODO: focus node
                }}
              >
                #
              </a>
              <span className="ml-1">{exportedNode.name}</span>
            </div>
            <ExportPreview node={exportedNode} />
          </>
        )}
      </div>
    </div>
  );
};

export default DTIFExport;

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;
