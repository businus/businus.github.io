import React, { useMemo, useRef, useState, useCallback, useEffect } from 'react';
import { Node } from './Node';
import { Group } from './Group';
import { Minimap } from './Minimap';
import { ZoomInIcon, ZoomOutIcon, ResetZoomIcon, ExportIcon, ImportIcon, UndoIcon, RedoIcon, RunIcon } from './icons';
import { NODE_WIDTH, NODE_HEIGHT } from '../constants';

const GRID_SIZE = 20;

const getEdgePath = (
  sourceNode,
  targetNode,
  sourceHandle
) => {
  const sourcePos = { ...sourceNode.position };
  const targetPos = { ...targetNode.position };

  sourcePos.x += NODE_WIDTH;
  targetPos.x -= 6; 

  if (sourceNode.type === 'IF_CONDITION') {
    sourcePos.y += sourceHandle === 'true' ? NODE_HEIGHT / 4 : NODE_HEIGHT * 3 / 4;
  } else if (sourceNode.type === 'LOOP_START') {
    sourcePos.y += sourceHandle === 'loopBody' ? NODE_HEIGHT / 4 : NODE_HEIGHT * 3 / 4;
  } else {
    sourcePos.y += NODE_HEIGHT / 2;
  }
  targetPos.y += NODE_HEIGHT / 2;

  const P0 = sourcePos;
  const P3 = targetPos;
  const curveX = Math.abs(P3.x - P0.x) * 0.6;
  const P1 = { x: P0.x + curveX, y: P0.y };
  const P2 = { x: P3.x - curveX, y: P3.y };
  
  const path = `M ${P0.x} ${P0.y} C ${P1.x} ${P1.y}, ${P2.x} ${P2.y}, ${P3.x} ${P3.y}`;
  
  const t = 0.5;
  const midPoint = {
    x: Math.pow(1 - t, 3) * P0.x + 3 * Math.pow(1 - t, 2) * t * P1.x + 3 * (1 - t) * t * t * P2.x + Math.pow(t, 3) * P3.x,
    y: Math.pow(1 - t, 3) * P0.y + 3 * Math.pow(1 - t, 2) * t * P1.y + 3 * (1 - t) * t * t * P2.y + Math.pow(t, 3) * P3.y,
  };

  let label = null;
  if (sourceNode.type === 'IF_CONDITION') {
    if (sourceHandle === 'true') label = 'True';
    if (sourceHandle === 'false') label = 'False';
  } else if (sourceNode.type === 'LOOP_START') {
    if (sourceHandle === 'loopBody') label = 'Loop Body';
    if (sourceHandle === 'afterLoop') label = 'After Loop';
  }
  return { path, label, midPoint };
};

export const WorkflowCanvas = ({
  nodes,
  edges,
  groups,
  onNodeClick,
  onCanvasClick,
  onSelectNodes,
  selectedNodeIds,
  onNodePositionChange,
  onNodeDragStart,
  onNodeDragStop,
  onGroupPositionChange,
  onGroupDragStart,
  onGroupDragStop,
  onToggleGroupCollapse,
  onDeleteNode,
  onAddEdge,
  onExport,
  onImport,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onRun,
  executionStatus,
  activeNodeId,
}) => {
  const canvasRef = useRef(null);
  const [viewTransform, setViewTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 0, height: 0 });
  const [draggingItem, setDraggingItem] = useState(null);
  const [drawingEdge, setDrawingEdge] = useState(null);
  const [hoveredInputTargetId, setHoveredInputTargetId] = useState(null);
  const [marqueeRect, setMarqueeRect] = useState(null);
  const isMarqueeSelectingRef = useRef(false);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        setCanvasDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    
    resizeObserver.observe(canvasEl);
    return () => resizeObserver.disconnect();
  }, []);


  const handleMouseDown = useCallback((e) => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    
    // Panning
    if (e.altKey || e.button === 1) {
      e.preventDefault();
      canvasEl.classList.add('select-none');
      const startPos = { x: e.clientX, y: e.clientY };
      const startTransform = { ...viewTransform };

      const handleMouseMove = (moveEvent) => {
        const dx = moveEvent.clientX - startPos.x;
        const dy = moveEvent.clientY - startPos.y;
        setViewTransform({
          ...startTransform,
          x: startTransform.x + dx,
          y: startTransform.y + dy,
        });
      };

      const handleMouseUp = () => {
        canvasEl.classList.remove('select-none');
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    // Marquee Selection / Clear selection
    else if (e.target === e.currentTarget && e.button === 0) {
      const rect = canvasEl.getBoundingClientRect();
      const startX = e.clientX - rect.left;
      const startY = e.clientY - rect.top;

      setMarqueeRect({ startX, startY, endX: startX, endY: startY });

      const handleMouseMove = (moveEvent) => {
          if (!isMarqueeSelectingRef.current) {
              const dx = Math.abs(moveEvent.clientX - rect.left - startX);
              const dy = Math.abs(moveEvent.clientY - rect.top - startY);
              if (dx > 5 || dy > 5) { // Threshold to differentiate click from drag
                  isMarqueeSelectingRef.current = true;
                  canvasEl.classList.add('select-none');
              }
          }
          
          if (isMarqueeSelectingRef.current) {
              const currentX = moveEvent.clientX - rect.left;
              const currentY = moveEvent.clientY - rect.top;
              setMarqueeRect(prev => prev ? { ...prev, endX: currentX, endY: currentY } : null);
          }
      };

      const handleMouseUp = (upEvent) => {
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('mouseup', handleMouseUp);
          canvasEl.classList.remove('select-none');

          if (isMarqueeSelectingRef.current && marqueeRect) {
              const marqueeStart = {
                  x: (Math.min(marqueeRect.startX, marqueeRect.endX) - viewTransform.x) / viewTransform.scale,
                  y: (Math.min(marqueeRect.startY, marqueeRect.endY) - viewTransform.y) / viewTransform.scale
              };
              const marqueeEnd = {
                  x: (Math.max(marqueeRect.startX, marqueeRect.endX) - viewTransform.x) / viewTransform.scale,
                  y: (Math.max(marqueeRect.startY, marqueeRect.endY) - viewTransform.y) / viewTransform.scale
              };

              const selectedIds = nodes.filter(node => {
                  const nodeRect = {
                      x: node.position.x,
                      y: node.position.y,
                      width: NODE_WIDTH,
                      height: NODE_HEIGHT
                  };
                  return marqueeStart.x < nodeRect.x + nodeRect.width &&
                         marqueeEnd.x > nodeRect.x &&
                         marqueeStart.y < nodeRect.y + nodeRect.height &&
                         marqueeEnd.y > nodeRect.y;
              }).map(node => node.id);

              onSelectNodes(selectedIds, upEvent.shiftKey);
          } else {
              onCanvasClick();
          }

          setMarqueeRect(null);
          isMarqueeSelectingRef.current = false;
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
  }, [viewTransform, onCanvasClick, onSelectNodes, nodes]);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const { deltaY } = e;
    const scaleFactor = 1.1;
    const newScale = deltaY < 0 ? viewTransform.scale * scaleFactor : viewTransform.scale / scaleFactor;
    const clampedScale = Math.max(0.2, Math.min(2, newScale));

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const mousePoint = {
        x: (mouseX - viewTransform.x) / viewTransform.scale,
        y: (mouseY - viewTransform.y) / viewTransform.scale
    };

    setViewTransform({
      scale: clampedScale,
      x: mouseX - mousePoint.x * clampedScale,
      y: mouseY - mousePoint.y * clampedScale,
    });
  }, [viewTransform]);

  const handleNodeMouseDown = useCallback((e, nodeId) => {
    if (e.button !== 0) return;
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    
    onNodeDragStart(nodeId);
    canvasRef.current.classList.add('select-none');

    const startX = e.clientX / viewTransform.scale;
    const startY = e.clientY / viewTransform.scale;

    setDraggingItem({
        type: 'node',
        id: nodeId,
        offset: { x: startX - node.position.x, y: startY - node.position.y },
    });
  }, [nodes, viewTransform.scale, onNodeDragStart]);

  const handleGroupMouseDown = useCallback((e, groupId) => {
    if (e.button !== 0) return;
    const group = groups.find(g => g.id === groupId);
    if (!group) return;

    onGroupDragStart(groupId);
    canvasRef.current.classList.add('select-none');
    
    const startX = e.clientX / viewTransform.scale;
    const startY = e.clientY / viewTransform.scale;
    
    setDraggingItem({
        type: 'group',
        id: groupId,
        offset: { x: startX - group.position.x, y: startY - group.position.y },
    });
  }, [groups, viewTransform.scale, onGroupDragStart]);

  const handleStartDrawingEdge = useCallback((sourceId, sourceHandle, startPosition) => {
    const sourceNode = nodes.find(n => n.id === sourceId);
    if (!sourceNode) return;
    
    let handlePos = { 
        x: sourceNode.position.x + 208, 
        y: sourceNode.position.y + 40
    };

    if (sourceNode.type === 'IF_CONDITION') {
        handlePos.y = sourceNode.position.y + (sourceHandle === 'true' ? 20 : 60);
    } else if (sourceNode.type === 'LOOP_START') {
        handlePos.y = sourceNode.position.y + (sourceHandle === 'loopBody' ? 20 : 60);
    }

    setDrawingEdge({
      sourceId,
      sourceHandle,
      startPos: handlePos,
      endPos: handlePos,
    });
  }, [nodes]);

  const handleMouseUpOnNodeInput = useCallback((targetId) => {
    if (drawingEdge) {
      if (drawingEdge.sourceId !== targetId) {
        onAddEdge({
          source: drawingEdge.sourceId,
          target: targetId,
          sourceHandle: drawingEdge.sourceHandle
        });
      }
      setDrawingEdge(null);
      setHoveredInputTargetId(null);
    }
  }, [drawingEdge, onAddEdge]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (draggingItem) {
          const newX = e.clientX / viewTransform.scale - draggingItem.offset.x;
          const newY = e.clientY / viewTransform.scale - draggingItem.offset.y;
          const snappedX = Math.round(newX / GRID_SIZE) * GRID_SIZE;
          const snappedY = Math.round(newY / GRID_SIZE) * GRID_SIZE;
          if (draggingItem.type === 'node') {
            onNodePositionChange(draggingItem.id, { x: snappedX, y: snappedY });
          } else {
            onGroupPositionChange(draggingItem.id, { x: snappedX, y: snappedY });
          }
      }
      if (drawingEdge) {
          const rect = canvasRef.current.getBoundingClientRect();
          const canvasX = (e.clientX - rect.left - viewTransform.x) / viewTransform.scale;
          const canvasY = (e.clientY - rect.top - viewTransform.y) / viewTransform.scale;
          setDrawingEdge(prev => prev ? { ...prev, endPos: { x: canvasX, y: canvasY } } : null);
      }
    };
    
    const handleMouseUp = () => {
      if (draggingItem) {
        if(draggingItem.type === 'node') onNodeDragStop();
        else onGroupDragStop();
        setDraggingItem(null);
        canvasRef.current.classList.remove('select-none');
      }
      if (drawingEdge) {
        setDrawingEdge(null);
        setHoveredInputTargetId(null);
      }
    };

    if (draggingItem || drawingEdge) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingItem, onNodePositionChange, onNodeDragStop, onGroupPositionChange, onGroupDragStop, viewTransform, drawingEdge]);

  const renderedEdges = useMemo(() => {
    const nodeMap = new Map(nodes.map(node => [node.id, node]));
    return edges.map(edge => {
      const sourceNode = nodeMap.get(edge.source);
      const targetNode = nodeMap.get(edge.target);
      if (!sourceNode || !targetNode) return null;

      const { path, label, midPoint } = getEdgePath(sourceNode, targetNode, edge.sourceHandle);
      
      let strokeColor = '#4b5563';
      if (edge.sourceHandle === 'true') strokeColor = '#22c55e';
      if (edge.sourceHandle === 'false') strokeColor = '#ef4444';

      return (
        <g key={edge.id}>
          <path d={path} stroke={strokeColor} strokeWidth="2" fill="none" />
          {label && (
            <>
              <text x={midPoint.x} y={midPoint.y} textAnchor="middle" dy=".3em" fill="#111827" stroke="#111827" strokeWidth="4" strokeLinejoin="round" style={{ fontSize: '12px', fontWeight: 'bold' }}>{label}</text>
              <text x={midPoint.x} y={midPoint.y} textAnchor="middle" dy=".3em" fill={strokeColor} style={{ fontSize: '12px', fontWeight: 'bold' }}>{label}</text>
            </>
          )}
        </g>
      );
    }).filter(Boolean);
  }, [nodes, edges]);

  const renderedLoopFeedbackLines = useMemo(() => {
    const loopStarts = nodes.filter(n => n.type === 'LOOP_START');
    const loopEnds = nodes.filter(n => n.type === 'LOOP_END');
    const lines = [];

    if (loopStarts.length > 0 && loopEnds.length > 0) {
        for (const endNode of loopEnds) {
            const potentialStarts = loopStarts
                .filter(startNode => startNode.position.y <= endNode.position.y)
                .sort((a,b) => endNode.position.y - a.position.y);
            
            if (potentialStarts.length > 0) {
                const startNode = potentialStarts[0];
                const start = { x: startNode.position.x + 104, y: startNode.position.y - 6 };
                const end = { x: endNode.position.x + 104, y: endNode.position.y + 56 };
                const midY = end.y + 40;
                const path = `M ${end.x} ${end.y} C ${end.x} ${midY}, ${start.x} ${midY}, ${start.x} ${start.y}`;
                lines.push(<path key={`loop-${startNode.id}-${endNode.id}`} d={path} stroke="#6b7280" strokeWidth="2" fill="none" strokeDasharray="5 5" />);
            }
        }
    }
    return lines;
  }, [nodes]);

  const collapsedNodeIds = useMemo(() => 
    new Set(groups.filter(g => g.isCollapsed).flatMap(g => g.nodeIds)),
    [groups]
  );
  const visibleNodes = useMemo(() => nodes.filter(n => !collapsedNodeIds.has(n.id)), [nodes, collapsedNodeIds]);

  return (
    <div
      ref={canvasRef}
      className="w-full h-full bg-slate-900 overflow-hidden relative"
      onMouseDown={handleMouseDown}
      onWheel={handleWheel}
    >
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{
          backgroundSize: `${GRID_SIZE * viewTransform.scale}px ${GRID_SIZE * viewTransform.scale}px`,
          backgroundPosition: `${viewTransform.x}px ${viewTransform.y}px`,
          backgroundImage: `radial-gradient(circle at center, #374151 1px, transparent 1px)`,
        }}
      />
      <div
        className="absolute top-0 left-0"
        style={{ transform: `translate(${viewTransform.x}px, ${viewTransform.y}px) scale(${viewTransform.scale})` }}
      >
        {groups.map(group => (
            <Group
                key={group.id}
                group={group}
                onMouseDown={handleGroupMouseDown}
                onToggleCollapse={onToggleGroupCollapse}
            />
        ))}

        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ width: '100vw', height: '100vh', transformOrigin: 'top left' }}>
            <g>
              {renderedEdges}
              {renderedLoopFeedbackLines}
              {drawingEdge && (
                <path
                  d={`M ${drawingEdge.startPos.x} ${drawingEdge.startPos.y} C ${drawingEdge.startPos.x + 50} ${drawingEdge.startPos.y}, ${drawingEdge.endPos.x - 50} ${drawingEdge.endPos.y}, ${drawingEdge.endPos.x} ${drawingEdge.endPos.y}`}
                  stroke="#a78bfa"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="4 4"
                />
              )}
            </g>
        </svg>

        {visibleNodes.map(node => (
          <Node
            key={node.id}
            node={node}
            onClick={onNodeClick}
            isSelected={selectedNodeIds.includes(node.id)}
            onMouseDown={handleNodeMouseDown}
            onDelete={onDeleteNode}
            onStartDrawingEdge={handleStartDrawingEdge}
            onMouseUpOnInput={handleMouseUpOnNodeInput}
            isDrawingEdge={!!drawingEdge}
            drawingEdgeSourceId={drawingEdge?.sourceId || null}
            hoveredInputTargetId={hoveredInputTargetId}
            onSetHoveredInputTarget={setHoveredInputTargetId}
            isExecuting={activeNodeId === node.id}
          />
        ))}
      </div>
      {marqueeRect && (
          <div
              className="absolute border border-emerald-500 bg-emerald-500/20 pointer-events-none"
              style={{
                  left: Math.min(marqueeRect.startX, marqueeRect.endX),
                  top: Math.min(marqueeRect.startY, marqueeRect.endY),
                  width: Math.abs(marqueeRect.startX - marqueeRect.endX),
                  height: Math.abs(marqueeRect.startY - marqueeRect.endY),
              }}
          />
      )}
      <Minimap 
        nodes={nodes}
        edges={edges}
        viewTransform={viewTransform}
        canvasDimensions={canvasDimensions}
        onPan={setViewTransform}
      />
      <div className="absolute bottom-4 right-4 bg-slate-800/50 backdrop-blur-md p-1 rounded-md shadow-lg flex items-center gap-1 border border-slate-700/50 z-10">
          <button onClick={onRun} disabled={executionStatus === 'RUNNING'} title="Run Workflow" className="p-1.5 hover:bg-slate-700 rounded-md text-slate-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"><RunIcon className="w-5 h-5"/></button>
          <div className="w-px h-6 bg-slate-700 mx-1"></div>
          <button onClick={onUndo} disabled={!canUndo} title="Undo (Ctrl+Z)" className="p-1.5 hover:bg-slate-700 rounded-md text-slate-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"><UndoIcon className="w-5 h-5"/></button>
          <button onClick={onRedo} disabled={!canRedo} title="Redo (Ctrl+Y)" className="p-1.5 hover:bg-slate-700 rounded-md text-slate-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"><RedoIcon className="w-5 h-5"/></button>
          <div className="w-px h-6 bg-slate-700 mx-1"></div>
          <button onClick={() => setViewTransform(v => ({...v, scale: Math.min(2, v.scale * 1.2)}))} className="p-1.5 hover:bg-slate-700 rounded-md text-slate-300 hover:text-white"><ZoomInIcon className="w-5 h-5"/></button>
          <span className="text-xs font-mono text-slate-400 w-10 text-center">{(viewTransform.scale * 100).toFixed(0)}%</span>
          <button onClick={() => setViewTransform(v => ({...v, scale: Math.max(0.2, v.scale / 1.2)}))} className="p-1.5 hover:bg-slate-700 rounded-md text-slate-300 hover:text-white"><ZoomOutIcon className="w-5 h-5"/></button>
          <button onClick={() => setViewTransform({x:0, y:0, scale:1})} className="p-1.5 hover:bg-slate-700 rounded-md text-slate-300 hover:text-white"><ResetZoomIcon className="w-5 h-5"/></button>
          <div className="w-px h-6 bg-slate-700 mx-1"></div>
          <button onClick={onImport} title="Import Workflow" className="p-1.5 hover:bg-slate-700 rounded-md text-slate-300 hover:text-white"><ImportIcon className="w-5 h-5"/></button>
          <button onClick={onExport} title="Export Workflow" className="p-1.5 hover:bg-slate-700 rounded-md text-slate-300 hover:text-white"><ExportIcon className="w-5 h-5"/></button>
      </div>
    </div>
  );
};