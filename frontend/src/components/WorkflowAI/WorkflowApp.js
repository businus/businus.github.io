import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { WorkflowCanvas } from './components/WorkflowCanvas';
import { SettingsPanel } from './components/SettingsPanel';
import { CredentialsModal } from './components/CredentialsModal';
import { LogPanel } from './components/LogPanel';
import { generateWorkflowFromPrompt, generateNodeFromPrompt } from './services/geminiService.js';
import { executeWorkflow } from './services/executionService.js';
import { NODE_TYPES, NODE_WIDTH, NODE_HEIGHT } from './constants.js';
import WorkflowSignupModal from '../shared/WorkflowSignupModal';

const WORKFLOW_STORAGE_KEY = 'busin.us-workflow-state';
const CREDENTIALS_STORAGE_KEY = 'busin.us-credentials';

// Custom hook for managing state history, moved outside the component
const useHistory = (initialStateFunc) => {
  const [history, setHistory] = useState(() => [initialStateFunc()]);
  const [index, setIndex] = useState(0);

  const setState = useCallback((
    action,
    overwrite = false
  ) => {
    const newState = typeof action === 'function' ? action(history[index]) : action;
    if (overwrite) {
      const newHistory = [...history];
      newHistory[index] = newState;
      setHistory(newHistory);
    } else {
      const newHistory = history.slice(0, index + 1);
      newHistory.push(newState);
      setHistory(newHistory);
      setIndex(newHistory.length - 1);
    }
  }, [history, index]);

  const undo = useCallback(() => {
    if (index > 0) setIndex(i => i - 1);
  }, [index]);

  const redo = useCallback(() => {
    // FIX: Corrected redo logic to increment index instead of decrementing
    if (index < history.length - 1) setIndex(i => i + 1);
  }, [index, history.length]);

  return {
    state: history[index],
    setState,
    undo,
    redo,
    canUndo: index > 0,
    canRedo: index < history.length - 1,
  };
};

const getInitialStateFromStorage = () => {
  try {
    const savedState = localStorage.getItem(WORKFLOW_STORAGE_KEY);
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      if (Array.isArray(parsedState.nodes) && Array.isArray(parsedState.edges)) {
        return {
            nodes: parsedState.nodes,
            edges: parsedState.edges,
            groups: parsedState.groups || [],
        };
      }
    }
  } catch (e) {
    console.error("Failed to load workflow from localStorage", e);
  }
  return { nodes: [], edges: [], groups: [] };
};

const getInitialCredentials = () => {
    try {
        const savedCreds = localStorage.getItem(CREDENTIALS_STORAGE_KEY);
        if (savedCreds) {
            const parsed = JSON.parse(savedCreds);
            if(Array.isArray(parsed)) return parsed;
        }
    } catch (e) {
        console.error("Failed to load credentials from localStorage", e);
    }
    return [];
};

const WorkflowApp = () => {
  const { state, setState, undo, redo, canUndo, canRedo } = useHistory(getInitialStateFromStorage);
  
  // Guard against undefined state during initialization race conditions
  if (!state) {
    return null;
  }

  const { nodes, edges, groups } = state;
  const [selectedNodeIds, setSelectedNodeIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [credentials, setCredentials] = useState(getInitialCredentials);
  const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);
  const [executionStatus, setExecutionStatus] = useState('IDLE');
  const [executionLogs, setExecutionLogs] = useState([]);
  const [activeNodeId, setActiveNodeId] = useState(null);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState(''); // Add this state for the AI prompt
  
  // Mobile state
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const dragStartPositionsRef = useRef(new Map());
  const clipboardRef = useRef({ nodes: [], edges: [] });
  const isDraggingRef = useRef(false);

  // Check if we're on mobile device
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 640); // Tailwind's sm breakpoint
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(WORKFLOW_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Failed to save workflow to localStorage", e);
    }
  }, [state]);

  useEffect(() => {
    try {
        localStorage.setItem(CREDENTIALS_STORAGE_KEY, JSON.stringify(credentials));
    } catch(e) {
        console.error("Failed to save credentials to localStorage", e);
    }
  }, [credentials]);

  const addCredential = useCallback((name, type, data) => {
    const newCredential = {
        id: `cred_${Date.now()}`,
        name,
        type,
        data,
    };
    setCredentials(prev => [...prev, newCredential]);
  }, []);

  const deleteCredential = useCallback((id) => {
    setCredentials(prev => prev.filter(c => c.id !== id));
    // Also remove this credentialId from any nodes that are using it
    setState(prevState => ({
        ...prevState,
        nodes: prevState.nodes.map(node => {
            if (node.data.credentialId === id) {
                const newData = { ...node.data, credentialId: '' };
                return { ...node, data: newData };
            }
            return node;
        })
    }), true); // overwrite history
  }, [setState]);

  const addNode = useCallback((type, label) => {
    const newNodeId = `node_${Date.now()}`;
    const nodeDefaults = NODE_TYPES[type];
    
    const newNode = {
      id: newNodeId,
      type: type,
      label: label || nodeDefaults.label,
      position: { x: 100 + (nodes.length % 5) * 250, y: 100 + Math.floor(nodes.length / 5) * 150 },
      data: { ...nodeDefaults.defaultData },
    };

    setState(prevState => ({ ...prevState, nodes: [...prevState.nodes, newNode] }));
    setSelectedNodeIds([newNodeId]);
  }, [nodes.length, setState]);

  const handleAiAddNode = useCallback(async (prompt) => {
    try {
        const { type, label } = await generateNodeFromPrompt(prompt);
        addNode(type, label);
        setAiPrompt(''); // Clear the prompt after successful generation
    } catch (err) {
        setError('Failed to generate node. Please try a different prompt.');
        console.error(err);
        setTimeout(() => setError(null), 3000);
    }
  }, [addNode]);
  
  const handleNodeClick = useCallback((nodeId, isShiftPressed) => {
    setSelectedNodeIds(prevSelected => {
      if (isShiftPressed) {
        const isSelected = prevSelected.includes(nodeId);
        return isSelected ? prevSelected.filter(id => id !== nodeId) : [...prevSelected, nodeId];
      }
      if (prevSelected.includes(nodeId) && prevSelected.length === 1) {
        return prevSelected;
      }
      return [nodeId];
    });
    
    // On mobile, open settings panel when a node is selected
    if (isMobile) {
      setIsSettingsOpen(true);
    }
  }, [isMobile]);

  const handleSelectNodes = useCallback((nodeIds, isShiftPressed) => {
    setSelectedNodeIds(prevSelected => {
      if (isShiftPressed) {
        const newIds = new Set([...prevSelected, ...nodeIds]);
        return Array.from(newIds);
      }
      return nodeIds;
    });
  }, []);

  const addEdge = useCallback((edge) => {
    setState(prevState => {
      const filteredEdges = prevState.edges.filter(e => !(e.source === edge.source && e.sourceHandle === edge.sourceHandle));
      const newEdge = {
        id: `edge_${edge.source}_${edge.sourceHandle || 'default'}-${edge.target}`,
        ...edge
      };
      return { ...prevState, edges: [...filteredEdges, newEdge] };
    });
  }, [setState]);

  const updateNode = useCallback((nodeId, updates) => {
    setState(prevState => ({
      ...prevState,
      nodes: prevState.nodes.map(node => {
        if (node.id === nodeId) {
          const updatedNode = { ...node };
          if (updates.label !== undefined) updatedNode.label = updates.label;
          if (updates.data) updatedNode.data = { ...node.data, ...updates.data };
          return updatedNode;
        }
        return node;
      })
    }));
  }, [setState]);

  const updateNodePosition = useCallback((draggedNodeId, newPosition) => {
    setState(prevState => {
        const startPositions = dragStartPositionsRef.current;
        const draggedNodeStartPos = startPositions.get(draggedNodeId);
        if (!draggedNodeStartPos) return prevState;

        const dx = newPosition.x - draggedNodeStartPos.x;
        const dy = newPosition.y - draggedNodeStartPos.y;

        const nodesToDrag = selectedNodeIds.length > 0 && selectedNodeIds.includes(draggedNodeId)
            ? selectedNodeIds
            : [draggedNodeId];

        let tempNodes = prevState.nodes.map(n => ({ ...n, position: { ...n.position } }));

        // Step 1: Move the dragged nodes
        tempNodes.forEach(node => {
            if (nodesToDrag.includes(node.id)) {
                const startPos = startPositions.get(node.id);
                if (startPos) {
                    node.position.x = startPos.x + dx;
                    node.position.y = startPos.y + dy;
                }
            }
        });

        // Step 2: Apply repulsion physics
        const ITERATIONS = 5;
        const PADDING = 5;

        for (let i = 0; i < ITERATIONS; i++) {
            for (let j = 0; j < tempNodes.length; j++) {
                for (let k = j + 1; k < tempNodes.length; k++) {
                    const nodeA = tempNodes[j];
                    const nodeB = tempNodes[k];

                    const isNodeADragged = nodesToDrag.includes(nodeA.id);
                    const isNodeBDragged = nodesToDrag.includes(nodeB.id);

                    if (isNodeADragged && isNodeBDragged) continue;

                    const rectA = { x: nodeA.position.x, y: nodeA.position.y, width: NODE_WIDTH, height: NODE_HEIGHT };
                    const rectB = { x: nodeB.position.x, y: nodeB.position.y, width: NODE_WIDTH, height: NODE_HEIGHT };
                    
                    const centerA = { x: rectA.x + rectA.width / 2, y: rectA.y + rectA.height / 2 };
                    const centerB = { x: rectB.x + rectB.width / 2, y: rectB.y + rectB.height / 2 };
                    
                    const deltaX = centerA.x - centerB.x;
                    const deltaY = centerA.y - centerB.y;

                    const overlapX = (rectA.width + rectB.width) / 2 - Math.abs(deltaX);
                    const overlapY = (rectA.height + rectB.height) / 2 - Math.abs(deltaY);

                    if (overlapX > 0 && overlapY > 0) {
                        const moveX = overlapX + PADDING;
                        const moveY = overlapY + PADDING;

                        if (overlapX < overlapY) {
                            const direction = deltaX > 0 ? 1 : -1;
                            const forceA = !isNodeADragged ? (isNodeBDragged ? moveX : moveX / 2) : 0;
                            const forceB = !isNodeBDragged ? (isNodeADragged ? moveX : moveX / 2) : 0;
                            nodeA.position.x += forceA * direction;
                            nodeB.position.x -= forceB * direction;
                        } else {
                            const direction = deltaY > 0 ? 1 : -1;
                            const forceA = !isNodeADragged ? (isNodeBDragged ? moveY : moveY / 2) : 0;
                            const forceB = !isNodeBDragged ? (isNodeADragged ? moveY : moveY / 2) : 0;
                            nodeA.position.y += forceA * direction;
                            nodeB.position.y -= forceB * direction;
                        }
                    }
                }
            }
        }
        return { ...prevState, nodes: tempNodes };
    }, true);
  }, [setState, selectedNodeIds]);

  const onNodeDragStart = useCallback((draggedNodeId) => {
    isDraggingRef.current = true;
    const posMap = new Map();
    const nodeMap = new Map(nodes.map(n => [n.id, n]));

    const idsToTrack = selectedNodeIds.length > 0 && selectedNodeIds.includes(draggedNodeId)
      ? selectedNodeIds
      : [draggedNodeId];
    
    idsToTrack.forEach(id => {
      const node = nodeMap.get(id);
      if (node) {
        posMap.set(id, node.position);
      }
    });

    dragStartPositionsRef.current = posMap;
  }, [nodes, selectedNodeIds]);

  const onNodeDragStop = useCallback(() => {
    if(!isDraggingRef.current) return;
    isDraggingRef.current = false;
    dragStartPositionsRef.current.clear();
    setState(state);
  }, [state, setState]);

  const deleteNodes = useCallback((nodeIds) => {
    setState(prevState => {
        const newNodes = prevState.nodes.filter(n => !nodeIds.includes(n.id));
        const newEdges = prevState.edges.filter(e => !nodeIds.includes(e.source) && !nodeIds.includes(e.target));
        const newGroups = prevState.groups.map(g => ({
            ...g,
            nodeIds: g.nodeIds.filter(id => !nodeIds.includes(id))
        })).filter(g => g.nodeIds.length > 0);

        return { nodes: newNodes, edges: newEdges, groups: newGroups };
    });
    setSelectedNodeIds([]);
  }, [setState]);

  const groupSelectedNodes = useCallback(() => {
    if (selectedNodeIds.length < 2) return;

    setState(prevState => {
        const selectedNodes = prevState.nodes.filter(n => selectedNodeIds.includes(n.id));
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        
        selectedNodes.forEach(n => {
            minX = Math.min(minX, n.position.x);
            minY = Math.min(minY, n.position.y);
            maxX = Math.max(maxX, n.position.x + NODE_WIDTH);
            maxY = Math.max(maxY, n.position.y + NODE_HEIGHT);
        });

        const PADDING = 40;
        const newGroup = {
            id: `group_${Date.now()}`,
            label: 'New Group',
            position: { x: minX - PADDING, y: minY - PADDING },
            size: { width: maxX - minX + PADDING * 2, height: maxY - minY + PADDING * 2 },
            nodeIds: [...selectedNodeIds],
            isCollapsed: false,
            color: ['#4f46e5', '#db2777', '#16a34a', '#d97706'][prevState.groups.length % 4],
        };

        return { ...prevState, groups: [...prevState.groups, newGroup] };
    });
    setSelectedNodeIds([]);
  }, [selectedNodeIds, setState]);

  const onGroupDragStart = useCallback((groupId) => {
    isDraggingRef.current = true;
    const group = groups.find(g => g.id === groupId);
    if (!group) return;

    const posMap = new Map();
    posMap.set(groupId, group.position);

    const nodeMap = new Map(nodes.map(n => [n.id, n]));
    group.nodeIds.forEach(nodeId => {
        const node = nodeMap.get(nodeId);
        if (node) posMap.set(nodeId, node.position);
    });
    
    dragStartPositionsRef.current = posMap;
  }, [nodes, groups]);
  
  const updateGroupPosition = useCallback((groupId, newPosition) => {
    setState(prevState => {
        const startPositions = dragStartPositionsRef.current;
        const groupStartPos = startPositions.get(groupId);
        if (!groupStartPos) return prevState;

        const dx = newPosition.x - groupStartPos.x;
        const dy = newPosition.y - groupStartPos.y;

        const tempGroups = prevState.groups.map(g => {
            if (g.id === groupId) {
                const startPos = startPositions.get(g.id);
                return { ...g, position: { x: startPos.x + dx, y: startPos.y + dy } };
            }
            return g;
        });

        const group = prevState.groups.find(g => g.id === groupId);
        const tempNodes = prevState.nodes.map(n => {
            if (group.nodeIds.includes(n.id)) {
                const startPos = startPositions.get(n.id);
                return { ...n, position: { x: startPos.x + dx, y: startPos.y + dy } };
            }
            return n;
        });

        return { ...prevState, nodes: tempNodes, groups: tempGroups };
    }, true);
  }, [setState]);

  const toggleGroupCollapse = useCallback((groupId) => {
    setState(prevState => ({
        ...prevState,
        groups: prevState.groups.map(g => g.id === groupId ? { ...g, isCollapsed: !g.isCollapsed } : g)
    }));
  }, [setState]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const isInputFocused = event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement;
      if (isInputFocused) return;

      if ((event.key === 'Delete' || event.key === 'Backspace') && selectedNodeIds.length > 0) {
        deleteNodes(selectedNodeIds);
      }
      
      const isUndo = (event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey;
      const isRedo = (event.ctrlKey || event.metaKey) && (event.key === 'y' || (event.shiftKey && event.key === 'z'));
      const isCopy = (event.ctrlKey || event.metaKey) && event.key === 'c';
      const isPaste = (event.ctrlKey || event.metaKey) && event.key === 'v';
      const isGroup = (event.ctrlKey || event.metaKey) && event.key === 'g';
      
      if (isGroup) { event.preventDefault(); groupSelectedNodes(); }
      if (isUndo) { event.preventDefault(); undo(); }
      if (isRedo) { event.preventDefault(); redo(); }

      if (isCopy && selectedNodeIds.length > 0) {
        event.preventDefault();
        const copiedNodes = nodes.filter(n => selectedNodeIds.includes(n.id));
        const copiedEdges = edges.filter(e => selectedNodeIds.includes(e.source) && selectedNodeIds.includes(e.target));
        clipboardRef.current = { nodes: copiedNodes, edges: copiedEdges };
      }

      if (isPaste && clipboardRef.current.nodes.length > 0) {
        event.preventDefault();
        const { nodes: copiedNodes, edges: copiedEdges } = clipboardRef.current;
        const idMapping = new Map();
        const newNodes = [];
        const newEdges = [];
        
        const findOpenPosition = (x, y, existingNodes) => {
            let newX = x;
            let newY = y;
            let collision = true;
            while(collision) {
                collision = false;
                for (const node of existingNodes) {
                    const rectA = { x: newX, y: newY, width: NODE_WIDTH, height: NODE_HEIGHT };
                    const rectB = { x: node.position.x, y: node.position.y, width: NODE_WIDTH, height: NODE_HEIGHT };
                    const overlapX = Math.max(0, Math.min(rectA.x + rectA.width, rectB.x + rectB.width) - Math.max(rectA.x, rectB.x));
                    const overlapY = Math.max(0, Math.min(rectA.y + rectA.height, rectB.y + rectB.height) - Math.max(rectA.y, rectB.y));
                    if (overlapX * overlapY > 0) {
                        collision = true;
                        newX += NODE_WIDTH / 4;
                        newY += NODE_HEIGHT / 4;
                        break;
                    }
                }
            }
            return { x: newX, y: newY };
        }

        copiedNodes.forEach(node => {
          const newId = `node_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
          idMapping.set(node.id, newId);
          const pos = findOpenPosition(node.position.x + 20, node.position.y + 20, [...nodes, ...newNodes]);
          newNodes.push({
            ...node,
            id: newId,
            position: pos,
            warnings: undefined,
          });
        });

        copiedEdges.forEach(edge => {
          const newSourceId = idMapping.get(edge.source);
          const newTargetId = idMapping.get(edge.target);
          if (newSourceId && newTargetId) {
            newEdges.push({
              ...edge,
              id: `edge_${newSourceId}_${edge.sourceHandle || 'default'}-${newTargetId}`,
              source: newSourceId,
              target: newTargetId,
            });
          }
        });

        setState(prevState => ({
          ...prevState,
          nodes: [...prevState.nodes, ...newNodes],
          edges: [...prevState.edges, ...newEdges],
        }));
        setSelectedNodeIds(newNodes.map(n => n.id));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedNodeIds, deleteNodes, undo, redo, setState, nodes, edges, groupSelectedNodes]);

  useEffect(() => {
    const warnings = new Map();
    nodes.forEach(node => {
      const nodeWarnings = [];
      const isConnectedIn = edges.some(e => e.target === node.id);
      const isConnectedOut = edges.some(e => e.source === node.id);
      if (node.type !== 'TRIGGER' && !isConnectedIn) nodeWarnings.push('Node has no input connection.');
      const terminalTypes = ['LOOP_END', 'SEND_EMAIL', 'LOGGER'];
      if (!terminalTypes.includes(node.type) && !isConnectedOut) nodeWarnings.push('Node has no output connection.');
      
      // Field validations
      if (node.type === 'SEND_EMAIL' && !node.data.to?.trim()) nodeWarnings.push("'To' field in email is missing.");
      if (node.type === 'CONNECT_API' && !node.data.url?.trim()) nodeWarnings.push("'URL' field in API connection is missing.");
      if (node.type === 'BROWSING_AGENT' && !node.data.url?.trim()) nodeWarnings.push("'URL' field for browsing agent is missing.");
      if (node.type === 'REGISTER_BUSINESS' && !node.data.businessName?.trim()) nodeWarnings.push("'Business Name' field is missing.");
      if (node.type === 'CREATE_WEBSITE' && !node.data.siteName?.trim()) nodeWarnings.push("'Site Name' field is missing.");
      if (node.type === 'MANAGE_INVOICES' && (!node.data.client?.trim() || !node.data.amount)) nodeWarnings.push("'Client' and 'Amount' fields are missing.");
      if (node.type === 'MARKET_RESEARCH' && !node.data.topic?.trim()) nodeWarnings.push("'Topic' field is missing.");
      if (node.type === 'COMPLIANCE_CHECK' && !node.data.checkType?.trim()) nodeWarnings.push("'Check Type' field is missing.");
      if (node.type === 'HIRE_EMPLOYEE' && !node.data.role?.trim()) nodeWarnings.push("'Role' field is missing.");

      // Credential validation
      if ((node.type === 'CONNECT_API' || node.type === 'QUERY_DATABASE') && !node.data.credentialId) {
        nodeWarnings.push("Credential not selected.");
      }

      if (nodeWarnings.length > 0) warnings.set(node.id, nodeWarnings);
    });

    let warningsChanged = nodes.some(n => JSON.stringify(n.warnings || []) !== JSON.stringify(warnings.get(n.id) || []));
    if (warningsChanged) {
      setState(prevState => ({
        ...prevState,
        nodes: prevState.nodes.map(n => ({ ...n, warnings: warnings.get(n.id) }))
      }), true);
    }
  }, [nodes, edges, setState]);

  // Check if user is authorized (has signed up)
  const isUserAuthorized = () => {
    const signupData = localStorage.getItem('busin.us-signup');
    return !!signupData;
  };

  const handleExport = useCallback(() => {
    // Check if user is authorized
    if (!isUserAuthorized()) {
      setShowSignupModal(true);
      return;
    }
    
    const workflowData = JSON.stringify({ nodes, edges, groups }, null, 2);
    const blob = new Blob([workflowData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `busin.us-workflow-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [nodes, edges, groups]);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Telegram integration functions
  const TELEGRAM_BOT_TOKEN = "7918152804:AAEfqKOSPdTW26F1OpWBhn3onVP3pk-6Jgs";
  const TELEGRAM_CHAT_ID = "-4856358827";

  function escapeMarkdown(text) {
    if (!text) return "N/A";
    return text.replace(/[_*[\]()~`>#+-=|{}.!]/g, (match) => `\\${match}`);
  }

  async function sendTelegramMessage(token, chatId, message) {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "MarkdownV2",
          disable_notification: true,
        }),
      }
    );
    const data = await response.json();
    if (!data.ok) {
      throw new Error(data.description);
    }
    return data;
  }

  const sendSignupToTelegram = async (name, email, nodes, edges, groups) => {
    const currentDateTime = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });

    // Create a summary of the workflow
    const nodeTypes = nodes.reduce((acc, node) => {
      acc[node.type] = (acc[node.type] || 0) + 1;
      return acc;
    }, {});

    const workflowSummary = Object.entries(nodeTypes)
      .map(([type, count]) => `${type}: ${count}`)
      .join(', ') || 'None';

    const message = [
      `*Workflow AI Signup & Export*`,
      `*Name:* ${escapeMarkdown(name)}`,
      `*Email:* ${escapeMarkdown(email)}`,
      `*Date and Time:* ${escapeMarkdown(currentDateTime)}`,
      `*Workflow Summary:* ${escapeMarkdown(workflowSummary)}`,
      `*Node Count:* ${nodes.length}`,
      `*Edge Count:* ${edges.length}`,
      `*Group Count:* ${groups.length}`,
    ].join("\n");

    try {
      // Send the signup message first
      const data = await sendTelegramMessage(TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, message);
      console.log("Telegram signup message sent:", data);
      
      // Send the full workflow as a document
      const workflowData = JSON.stringify({ nodes, edges, groups }, null, 2);
      const blob = new Blob([workflowData], { type: 'application/json' });
      
      const formData = new FormData();
      formData.append('chat_id', TELEGRAM_CHAT_ID);
      formData.append('document', blob, `workflow-${Date.now()}.json`);
      formData.append('caption', `Workflow export for ${escapeMarkdown(name)} (${escapeMarkdown(email)})`);
      
      const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, {
        method: 'POST',
        body: formData
      });
      
      const documentData = await response.json();
      if (!documentData.ok) {
        console.error("Error sending workflow document:", documentData.description);
      } else {
        console.log("Telegram workflow document sent:", documentData);
      }
      
      return true;
    } catch (error) {
      console.error("Error sending Telegram message:", error);
      return false;
    }
  };

  // Removed handleSignupSubmit function as it's now handled by WorkflowSignupModal component

  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target.result;
          const data = JSON.parse(content);
          if (Array.isArray(data.nodes) && Array.isArray(data.edges)) {
            setState({ nodes: data.nodes, edges: data.edges, groups: data.groups || [] });
            setSelectedNodeIds([]);
            setError(null);
          } else {
            throw new Error('Invalid workflow file structure.');
          }
        } catch (err) {
          console.error("Failed to import workflow:", err);
          setError('Failed to import workflow. Please check the file format.');
          setTimeout(() => setError(null), 5000);
        }
      };
      reader.onerror = () => {
         console.error("Failed to read file.");
         setError('Failed to read the selected file.');
         setTimeout(() => setError(null), 5000);
      }
      reader.readAsText(file);
    };
    input.click();
  }, [setState]);

  const handleAiGenerate = async (prompt) => {
    setIsLoading(true);
    setError(null);
    setSelectedNodeIds([]);
    try {
      const generatedNodes = await generateWorkflowFromPrompt(prompt);
      const newNodes = [];
      const newEdges = [];
      generatedNodes.forEach((genNode, index) => {
        const nodeId = `node_ai_${Date.now()}_${index}`;
        const nodeType = genNode.type;
        const nodeDefaults = NODE_TYPES[nodeType];
        if (nodeDefaults) {
          const workflowNode = { id: nodeId, type: nodeType, label: genNode.label, position: { x: 100 + index * 250, y: 200 }, data: { ...nodeDefaults.defaultData } };
          newNodes.push(workflowNode);
          if (index > 0) {
            const prevNode = newNodes[index - 1];
            const newEdge = { id: `edge_ai_${prevNode.id}-${nodeId}`, source: prevNode.id, target: nodeId };
            if (prevNode.type === 'IF_CONDITION') newEdge.sourceHandle = 'true';
            if (prevNode.type === 'LOOP_START') newEdge.sourceHandle = 'loopBody';
            newEdges.push(newEdge);
          }
        }
      });
      setState({ nodes: newNodes, edges: newEdges, groups: [] });
    } catch (err) {
      setError('Failed to generate workflow. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunWorkflow = async () => {
    setExecutionStatus('RUNNING');
    setExecutionLogs([]);
    setActiveNodeId(null);
    setSelectedNodeIds([]);

    const onLog = (log) => setExecutionLogs(prev => [...prev, log]);
    const onSetActive = (nodeId) => setActiveNodeId(nodeId);

    const finalStatus = await executeWorkflow({
        nodes,
        edges,
        credentials,
        onLog,
        onSetActiveNode: onSetActive,
    });

    setExecutionStatus(finalStatus);
    setActiveNodeId(null);
  };

  const lastSelectedNodeId = selectedNodeIds.length > 0 ? selectedNodeIds[selectedNodeIds.length - 1] : null;
  const selectedNode = nodes.find(node => node.id === lastSelectedNodeId) || null;

  return (
    <div className="flex flex-col h-screen bg-dark-bg">
      <Header onGenerate={handleAiGenerate} isLoading={isLoading} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          onAddNode={(type) => addNode(type)} 
          onAiAddNode={handleAiAddNode}
          isMobile={isMobile}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          aiPrompt={aiPrompt} // Pass the AI prompt state
          setAiPrompt={setAiPrompt} // Pass the setter function
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-grow flex flex-col relative">
            <WorkflowCanvas
              nodes={nodes}
              edges={edges}
              groups={groups}
              onNodeClick={handleNodeClick}
              onCanvasClick={() => {
                setSelectedNodeIds([]);
                if (isMobile) {
                  setIsSettingsOpen(false);
                  setIsSidebarOpen(false);
                }
              }}
              onSelectNodes={handleSelectNodes}
              selectedNodeIds={selectedNodeIds}
              onNodePositionChange={updateNodePosition}
              onNodeDragStart={onNodeDragStart}
              onNodeDragStop={onNodeDragStop}
              onGroupPositionChange={updateGroupPosition}
              onGroupDragStart={onGroupDragStart}
              onGroupDragStop={onNodeDragStop}
              onToggleGroupCollapse={toggleGroupCollapse}
              onDeleteNode={(nodeId) => deleteNodes([nodeId])}
              onAddEdge={addEdge}
              onExport={handleExport}
              onImport={handleImport}
              onUndo={undo}
              onRedo={redo}
              canUndo={canUndo}
              canRedo={canRedo}
              onRun={handleRunWorkflow}
              executionStatus={executionStatus}
              activeNodeId={activeNodeId}
            />
            
            {error && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-500/90 text-white px-4 py-2 rounded-md shadow-lg z-50">
                {error}
              </div>
            )}
          </main>
        </div>
        
        <SettingsPanel
          node={selectedNode}
          selectedCount={selectedNodeIds.length}
          onClose={() => setSelectedNodeIds([])}
          onUpdate={updateNode}
          credentials={credentials}
          onOpenCredentialsModal={() => setIsCredentialsModalOpen(true)}
          isMobile={isMobile}
          isSettingsOpen={isSettingsOpen}
          setIsSettingsOpen={setIsSettingsOpen}
        />
      </div>
      
      {/* Mobile floating action buttons */}
      {isMobile && (
        <div className="fixed bottom-4 left-4 z-30">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="bg-brand-primary text-white p-3 rounded-full shadow-lg hover:bg-brand-primary/90 transition-colors"
            title="Open Nodes Panel"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      )}
      
      {/* Mobile settings button */}
      {isMobile && selectedNodeIds.length > 0 && (
        <div className="fixed bottom-4 right-20 z-30">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="bg-brand-secondary text-white p-3 rounded-full shadow-lg hover:bg-brand-secondary/90 transition-colors"
            title="Open Settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      )}
      
      <CredentialsModal
          isOpen={isCredentialsModalOpen}
          onClose={() => setIsCredentialsModalOpen(false)}
          credentials={credentials}
          onAddCredential={addCredential}
          onDeleteCredential={deleteCredential}
       />
       <LogPanel logs={executionLogs} status={executionStatus} />
       
       {/* Signup Modal */}
       {showSignupModal && (
        <WorkflowSignupModal
          isOpen={showSignupModal}
          onClose={() => setShowSignupModal(false)}
          onExport={handleExport}
          nodes={nodes}
          edges={edges}
          groups={groups}
        />
       )}
    </div>
  );
};

export default WorkflowApp;