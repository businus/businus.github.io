import React from 'react';
import { ChevronUpIcon, ChevronDownIcon } from './icons';

export const Group = ({ group, onMouseDown, onToggleCollapse }) => {
  return (
    <div
      className="absolute rounded-xl border-2 transition-all duration-300 z-0"
      style={{
        left: group.position.x,
        top: group.position.y,
        width: group.size.width,
        height: group.isCollapsed ? '40px' : group.size.height,
        borderColor: group.color,
        backgroundColor: `${group.color}1A`,
      }}
    >
      <div
        className="h-10 px-4 flex items-center justify-between rounded-t-lg cursor-move select-none"
        style={{ backgroundColor: `${group.color}33` }}
        onMouseDown={(e) => onMouseDown(e, group.id)}
      >
        <span className="font-bold text-sm text-dark-text-primary pointer-events-none">{group.label}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onToggleCollapse(group.id);
          }}
          className="p-1 rounded-full hover:bg-black/20 text-dark-text-primary"
          title={group.isCollapsed ? "Expand Group" : "Collapse Group"}
        >
          {group.isCollapsed ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronUpIcon className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};