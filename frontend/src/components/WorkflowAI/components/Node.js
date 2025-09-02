import React from 'react';
import { NODE_TYPES } from '../constants.js';
import { DeleteIcon, WarningIcon } from './icons';

const Handle = ({ 
    onMouseDown, 
    onMouseUp, 
    className, 
    title, 
    colorClass = 'border-dark-border', 
    isHighlighted 
}) => (
    <div 
        title={title}
        className={`absolute w-3 h-3 bg-dark-surface border-2 rounded-full cursor-crosshair z-10 transition-transform ${className} ${colorClass} ${isHighlighted ? 'scale-150 bg-brand-primary' : ''}`}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
    />
);

export const Node = ({ 
    node, 
    onClick, 
    isSelected, 
    onMouseDown, 
    onDelete, 
    onStartDrawingEdge, 
    onMouseUpOnInput,
    isDrawingEdge,
    drawingEdgeSourceId,
    hoveredInputTargetId,
    onSetHoveredInputTarget,
    isExecuting
}) => {
  const nodeInfo = NODE_TYPES[node.type];
  const isEndNode = node.type === 'LOOP_END';
  const hasWarnings = node.warnings && node.warnings.length > 0;

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(node.id);
  };
  
  const handleMouseDown = (e) => {
    if ((e.target).closest('[title]')) {
      return;
    }
    onMouseDown(e, node.id);
  };
  
  const handleHandleMouseDown = (e, sourceHandle) => {
    e.stopPropagation();
    onStartDrawingEdge(node.id, sourceHandle);
  };

  const handleInputMouseUp = (e) => {
    e.stopPropagation();
    onMouseUpOnInput(node.id);
  };
  
  const isPotentialTarget = isDrawingEdge && node.id !== drawingEdgeSourceId;

  return (
    <div
      className={`absolute w-52 p-3 rounded-lg shadow-xl transition-all duration-200 flex items-center gap-3 bg-dark-surface border ${
        isSelected ? 'border-brand-primary ring-2 ring-brand-primary/50' : 'border-dark-border hover:border-brand-secondary/50'
      } ${isEndNode ? 'h-14' : 'h-20'} ${isExecuting ? 'border-green-500 ring-2 ring-green-500/50 shadow-[0_0_15px_3px_rgba(74,222,128,0.7)]' : ''}`}
      style={{ top: `${node.position.y}px`, left: `${node.position.x}px`, cursor: 'pointer' }}
      onClick={(e) => onClick(node.id, e.shiftKey)}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => isPotentialTarget && onSetHoveredInputTarget(node.id)}
      onMouseLeave={() => isPotentialTarget && onSetHoveredInputTarget(null)}
    >
      {isSelected && !isExecuting && (
        <button 
          onClick={handleDeleteClick}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-700 transition-colors z-20"
          aria-label={`Delete ${node.label} node`}
        >
          <DeleteIcon className="w-4 h-4" />
        </button>
      )}
      
      {hasWarnings && (
        <div className="absolute -top-2 -left-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-dark-bg z-10 group">
          <WarningIcon className="w-4 h-4" />
          <div className="absolute bottom-full mb-2 w-max max-w-xs bg-dark-bg text-white text-xs rounded py-1 px-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
            <ul className="list-disc list-inside">
              {node.warnings?.map((warning, i) => <li key={i}>{warning}</li>)}
            </ul>
          </div>
        </div>
      )}

      <div className={`flex-shrink-0 p-2 rounded-md ${ isSelected || isExecuting ? 'text-brand-primary' : 'text-brand-secondary'}`}>
         {nodeInfo.icon}
      </div>
      <div className="overflow-hidden">
        <p className="font-bold text-sm text-dark-text-primary truncate">{node.label}</p>
        <p className="text-xs text-dark-text-secondary">{nodeInfo.label}</p>
      </div>
      
      {node.type !== 'TRIGGER' && 
        <Handle 
            title="Input" 
            className="-left-1.5 top-1/2 -translate-y-1/2" 
            onMouseUp={handleInputMouseUp}
            isHighlighted={isPotentialTarget && hoveredInputTargetId === node.id}
        />
      }

      {node.type === 'IF_CONDITION' ? (
        <>
          <Handle title="True path" className="-right-1.5 top-1/4 -translate-y-1/2" onMouseDown={(e) => handleHandleMouseDown(e, 'true')} colorClass="border-green-500 hover:ring-2 hover:ring-green-400" />
          <Handle title="False path" className="-right-1.5 top-3/4 -translate-y-1/2" onMouseDown={(e) => handleHandleMouseDown(e, 'false')} colorClass="border-red-500 hover:ring-2 hover:ring-red-400"/>
        </>
      ) : node.type === 'LOOP_START' ? (
         <>
          <Handle title="Loop Body" className="-right-1.5 top-1/4 -translate-y-1/2" onMouseDown={(e) => handleHandleMouseDown(e, 'loopBody')} colorClass="border-purple-400 hover:ring-2 hover:ring-purple-300"/>
          <Handle title="After Loop" className="-right-1.5 top-3/4 -translate-y-1/2" onMouseDown={(e) => handleHandleMouseDown(e, 'afterLoop')} colorClass="border-gray-500 hover:ring-2 hover:ring-gray-400"/>
        </>
      ) : node.type === 'LOOP_END' ? null : (
        <Handle title="Output" className="-right-1.5 top-1/2 -translate-y-1/2" onMouseDown={handleHandleMouseDown}/>
      )}
    </div>
  );
};