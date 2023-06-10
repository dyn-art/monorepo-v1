import { TNode } from '@pda/dtif-types';
import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { EUIPageRoute, TOnSelectFrameEvent, logger } from '../../../shared';
import { copyToClipboard } from '../../core';
import { TUIHandler, uiHandler } from '../../ui-handler';
import ExportPreview from './ExportPreview';
import './styles.css';

const DEFAULT_SELECT = 'default';

const DTIFExport: React.FC = () => {
  const [selectedFrames, setSelectedFrames] = React.useState<
    TOnSelectFrameEvent['args']['selected']
  >([]);
  const [selectedFrameId, setSelectedFrameId] = React.useState<string | null>(
    null
  );
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
      key: 'on-select-frame',
      callback: async (instance: TUIHandler, args) => {
        console.log('onselect', { args });
        if (args.selected != null && args.selected.length > 0) {
          setSelectedFrames(args.selected);
          setSelectedFrameId(args.selected[args.selected.length - 1].name);
        } else {
          setSelectedFrames([]);
          setSelectedFrameId(DEFAULT_SELECT);
        }
      },
    });

    // Intermediate format export result event
    uiHandler.registerEvent({
      type: 'figma.message',
      key: 'intermediate-format-export-result',
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

      // Find selected frame
      const selectedFrame = selectedFrames.find(
        (frame) => frame.name === selectedFrameId
      );

      // Send export event to sandbox
      if (selectedFrame != null) {
        uiHandler.postMessage('intermediate-format-export', {
          selectedElements: [selectedFrame],
          config: {
            svgExportIdentifierRegex: '_svg$',
            frameToSVG: false,
            gradientToSVG: true,
          },
        });
      } else {
        // TODO: error handling
      }
    }
  }, [selectedFrames, selectedFrameId]);

  const onFrameSelect = useCallback(
    (event: React.ChangeEventHandler<HTMLSelectElement> | undefined) => {
      const frameName = (event as any)?.target?.value;
      if (typeof frameName === 'string') {
        setSelectedFrameId(frameName);
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
            <Link to={EUIPageRoute.HOME}>Home</Link>
          </li>
          <li>Export Frame</li>
        </ul>
      </div>
      <div className="space-y-4">
        {/* Select */}
        <details open className="collapse flex flex-col bg-base-content">
          <summary className="collapse-title">
            <p className="text-base-300">SELECT FRAME</p>
          </summary>
          <div className="collapse-content z-10 -mt-3">
            {/* Select Form */}
            <div className="form-control">
              <select
                className="select-bordered select"
                disabled={isExporting}
                value={selectedFrameId ?? 'default'}
                onChange={onFrameSelect as any}
              >
                {selectedFrames.length > 0 ? (
                  selectedFrames.map((frame) => (
                    <option key={frame.id} value={frame.id}>
                      {frame.name}
                    </option>
                  ))
                ) : (
                  <>
                    <option
                      key={DEFAULT_SELECT}
                      value={DEFAULT_SELECT}
                      disabled
                    >
                      Pick a frame
                    </option>
                    <option
                      key={`${DEFAULT_SELECT}-info-1`}
                      value={`${DEFAULT_SELECT}-info-1`}
                      disabled
                    >
                      PressCTRL + A to select all in Figma editor.
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

            {/* Export button */}
            <button
              className="btn-success btn-sm btn mt-1 w-20"
              onClick={onExport}
            >
              {isExporting ? (
                <span className="loading loading-spinner text-primary"></span>
              ) : (
                'EXPORT'
              )}
            </button>
          </div>
        </details>

        {/* Preview */}
        {exportedNode != null && (
          <>
            <div className="divider pb-4 pt-4">EXPORTED TO</div>
            <div className="text-sm font-bold">
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
