import React, { useMemo, useCallback } from 'react';

const NODE_WIDTH = 208;
const NODE_HEIGHT = 80;
const MINIMAP_MAX_SIZE = 200;
const PADDING = 50;

export const Minimap = ({ nodes, edges, viewTransform, canvasDimensions, onPan }) => {
    const { bounds, minimapScale, minimapWidth, minimapHeight } = useMemo(() => {
        if (nodes.length === 0) {
            const defaultSize = MINIMAP_MAX_SIZE / 2;
            return {
                bounds: { minX: 0, minY: 0, maxX: defaultSize, maxY: defaultSize },
                minimapScale: 1,
                minimapWidth: defaultSize,
                minimapHeight: defaultSize
            };
        }

        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        nodes.forEach(node => {
            minX = Math.min(minX, node.position.x);
            minY = Math.min(minY, node.position.y);
            maxX = Math.max(maxX, node.position.x + NODE_WIDTH);
            maxY = Math.max(maxY, node.position.y + NODE_HEIGHT);
        });

        const bounds = { minX: minX - PADDING, minY: minY - PADDING, maxX: maxX + PADDING, maxY: maxY + PADDING };
        const boundsWidth = bounds.maxX - bounds.minX;
        const boundsHeight = bounds.maxY - bounds.minY;

        const scale = Math.min(MINIMAP_MAX_SIZE / boundsWidth, MINIMAP_MAX_SIZE / boundsHeight);
        const width = boundsWidth * scale;
        const height = boundsHeight * scale;

        return { bounds, minimapScale: scale, minimapWidth: width, minimapHeight: height };
    }, [nodes]);
    
    const viewport = useMemo(() => {
        const viewportWidth = canvasDimensions.width / viewTransform.scale;
        const viewportHeight = canvasDimensions.height / viewTransform.scale;
        const viewportX = -viewTransform.x / viewTransform.scale;
        const viewportY = -viewTransform.y / viewTransform.scale;

        return {
            x: (viewportX - bounds.minX) * minimapScale,
            y: (viewportY - bounds.minY) * minimapScale,
            width: viewportWidth * minimapScale,
            height: viewportHeight * minimapScale,
        };
    }, [bounds, minimapScale, canvasDimensions, viewTransform]);

    const handleMouseDown = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const rect = e.currentTarget.getBoundingClientRect();
        const startX = e.clientX;
        const startY = e.clientY;
        const startTransform = { ...viewTransform };
        
        const isViewportDrag = e.target === e.currentTarget.querySelector('#viewport-rect');
        
        // Center view on click if not dragging viewport
        if (!isViewportDrag) {
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;

            const worldX = (clickX / minimapScale) + bounds.minX;
            const worldY = (clickY / minimapScale) + bounds.minY;

            onPan({
                ...viewTransform,
                x: -worldX * viewTransform.scale + canvasDimensions.width / 2,
                y: -worldY * viewTransform.scale + canvasDimensions.height / 2,
            });
        }
        
        const handleMouseMove = (moveEvent) => {
            const dx = moveEvent.clientX - startX;
            const dy = moveEvent.clientY - startY;

            const panDx = -(dx / minimapScale) * viewTransform.scale;
            const panDy = -(dy / minimapScale) * viewTransform.scale;

            onPan({
                ...startTransform,
                x: startTransform.x + panDx,
                y: startTransform.y + panDy,
            });
        };

        const handleMouseUp = () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

    }, [viewTransform, minimapScale, bounds, canvasDimensions, onPan]);

    return (
        <div 
            className="absolute bottom-4 left-4 bg-dark-surface/80 backdrop-blur-sm border border-dark-border rounded-md shadow-lg overflow-hidden z-10"
            style={{ width: minimapWidth, height: minimapHeight }}
        >
            <svg
                width={minimapWidth}
                height={minimapHeight}
                viewBox={`0 0 ${minimapWidth} ${minimapHeight}`}
                onMouseDown={handleMouseDown}
            >
                <g>
                    {nodes.map(node => {
                        const x = (node.position.x - bounds.minX) * minimapScale;
                        const y = (node.position.y - bounds.minY) * minimapScale;
                        const width = NODE_WIDTH * minimapScale;
                        const height = NODE_HEIGHT * minimapScale;
                        let color = '#4f46e5'; // brand-primary
                        if (node.type === 'TRIGGER') color = '#7c3aed'; // brand-secondary
                        if (node.type === 'IF_CONDITION') color = '#db2777'; // pink
                        
                        return (
                          <rect
                            key={node.id}
                            x={x}
                            y={y}
                            width={width}
                            height={height}
                            fill={color}
                            opacity="0.6"
                            rx="2"
                          />
                        );
                    })}
                </g>
                <rect
                    id="viewport-rect"
                    x={viewport.x}
                    y={viewport.y}
                    width={viewport.width}
                    height={viewport.height}
                    fill="rgba(255, 255, 255, 0.2)"
                    stroke="#f9fafb"
                    strokeWidth="1"
                    className="cursor-grab"
                />
            </svg>
        </div>
    );
};