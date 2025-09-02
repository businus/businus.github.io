import React, { useState, useMemo, useEffect } from 'react';
import { NodeType } from '../types.js';
import { NODE_TYPES } from '../constants.js';
import { AIGenerateIcon, SearchIcon, StarIcon, StarOutlineIcon } from './icons';

const nodeCategoriesRaw = [
    {
        name: 'Flow Control',
        nodes: [NodeType.TRIGGER, NodeType.IF_CONDITION, NodeType.LOOP_START, NodeType.LOOP_END, NodeType.WAIT]
    },
    {
        name: 'Integrations',
        nodes: [NodeType.SEND_EMAIL, NodeType.UPDATE_CRM, NodeType.SOCIAL_POST, NodeType.QUERY_DATABASE, NodeType.CONNECT_API]
    },
    {
        name: 'Busin.US', // Renamed from Business Automation
        nodes: [NodeType.REGISTER_BUSINESS, NodeType.HIRE_EMPLOYEE, NodeType.EXPAND_BUSINESS, NodeType.CREATE_WEBSITE, NodeType.GENERATE_DOCUMENT, NodeType.MANAGE_INVOICES, NodeType.FILE_TAXES, NodeType.COMPLIANCE_CHECK]
    },
    {
        name: 'AI & Data',
        nodes: [NodeType.BROWSING_AGENT, NodeType.DASHBOARD, NodeType.MARKET_RESEARCH]
    },
    {
        name: 'Developer',
        nodes: [NodeType.CODE, NodeType.LOGGER]
    }
];

// Pin Busin.US category to the top
const businUsIndex = nodeCategoriesRaw.findIndex(c => c.name === 'Busin.US');
const businUsCategory = nodeCategoriesRaw.splice(businUsIndex, 1)[0];
const sortedNodeCategories = [businUsCategory, ...nodeCategoriesRaw];

const FAVORITES_STORAGE_KEY = 'busin.us-favorite-nodes';


const AiNodeCreator = ({ onAiAddNode }) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!prompt.trim() || isLoading) return;
        setIsLoading(true);
        await onAiAddNode(prompt);
        setIsLoading(false);
        setPrompt('');
    };

    return (
        <div className="mb-4">
            <h3 className="text-md font-semibold text-dark-text-primary mb-2">Create with AI</h3>
            <form onSubmit={handleSubmit} className="relative">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., 'check if user is premium'"
                    className="w-full bg-dark-bg border border-dark-border rounded-md py-2 pl-3 pr-10 text-sm text-dark-text-primary placeholder-dark-text-secondary focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading || !prompt.trim()}
                    className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-dark-text-secondary hover:bg-brand-primary hover:text-white disabled:hover:bg-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Generate Node"
                >
                    {isLoading ? (
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <AIGenerateIcon className="w-4 h-4" />
                    )}
                </button>
            </form>
        </div>
    );
};


export const Sidebar = ({ onAddNode, onAiAddNode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [favoriteNodes, setFavoriteNodes] = useState(() => {
    try {
        const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
        return savedFavorites ? JSON.parse(savedFavorites) : [];
    } catch (e) {
        console.error("Failed to load favorite nodes from localStorage", e);
        return [];
    }
  });

  useEffect(() => {
    try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteNodes));
    } catch (e) {
        console.error("Failed to save favorite nodes to localStorage", e);
    }
  }, [favoriteNodes]);

  const toggleFavorite = (nodeType) => {
    setFavoriteNodes(prev => 
        prev.includes(nodeType)
            ? prev.filter(t => t !== nodeType)
            : [...prev, nodeType]
    );
  };

  const filteredCategories = useMemo(() => {
    const lowercasedFilter = searchTerm.toLowerCase().trim();
    
    let allCategories = [...sortedNodeCategories];

    if (favoriteNodes.length > 0) {
        allCategories.unshift({
            name: 'Favorites',
            nodes: favoriteNodes
        });
    }

    if (!lowercasedFilter) {
      return allCategories.map(category => ({
        ...category,
        nodes: category.nodes.map(nodeType => NODE_TYPES[nodeType])
      }));
    }

    return allCategories
      .map(category => {
        const filteredNodes = category.nodes
          .map(nodeType => NODE_TYPES[nodeType])
          .filter(nodeInfo =>
            nodeInfo.label.toLowerCase().includes(lowercasedFilter) ||
            nodeInfo.description.toLowerCase().includes(lowercasedFilter)
          );
        return { ...category, nodes: filteredNodes };
      })
      .filter(category => category.nodes.length > 0);
  }, [searchTerm, favoriteNodes]);

  return (
    <aside className="w-72 bg-dark-surface border-r border-dark-border p-4 flex-shrink-0 z-20 flex flex-col">
      <AiNodeCreator onAiAddNode={onAiAddNode} />
      <div className="w-full h-px bg-dark-border my-4"></div>
      <h2 className="text-lg font-semibold text-dark-text-primary mb-3">Nodes</h2>
      <div className="relative mb-3">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-text-secondary" />
        <input
          type="text"
          placeholder="Search nodes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-dark-bg border border-dark-border rounded-md py-2 pl-9 pr-3 text-sm text-dark-text-primary placeholder-dark-text-secondary focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
        />
      </div>
      <div className="flex-grow overflow-y-auto -mr-2 pr-2">
        {filteredCategories.map((category) => (
          <div key={category.name}>
            <h3 className="text-xs font-bold uppercase text-dark-text-secondary tracking-wider mt-4 mb-2 px-1">
              {category.name}
            </h3>
            <div className="space-y-2">
              {category.nodes.map((nodeInfo) => (
                <div
                  key={nodeInfo.type}
                  title={nodeInfo.description}
                  className="w-full flex items-center gap-3 p-2 rounded-md bg-dark-bg border border-transparent hover:bg-brand-primary/20 hover:border-brand-primary transition-all text-left group"
                >
                  <button onClick={() => onAddNode(nodeInfo.type)} className="flex-grow flex items-center gap-3 text-left">
                    <div className="p-2 bg-dark-surface rounded-md text-brand-secondary group-hover:text-brand-primary">
                      {nodeInfo.icon}
                    </div>
                    <div>
                      <p className="font-medium text-dark-text-primary">{nodeInfo.label}</p>
                    </div>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(nodeInfo.type);
                    }}
                    className="p-1 rounded-full text-dark-text-secondary/50 opacity-0 group-hover:opacity-100 hover:text-yellow-400 transition-opacity"
                    title={favoriteNodes.includes(nodeInfo.type) ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    {favoriteNodes.includes(nodeInfo.type) ? 
                        <StarIcon className="w-4 h-4 text-yellow-400" /> : 
                        <StarOutlineIcon className="w-4 h-4" />
                    }
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
        {filteredCategories.length === 0 && (
          <p className="text-sm text-dark-text-secondary text-center mt-6">No nodes found.</p>
        )}
      </div>
    </aside>
  );
};