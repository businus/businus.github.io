import React, { useState, useEffect, useRef, memo } from 'react';
import { ExecutionStatus } from '../types.js';
import { ChevronDownIcon, ChevronUpIcon } from './icons';

const LogLine = memo(({ log }) => {
    const getStatusColor = () => {
        switch (log.type) {
            case 'error': return 'text-red-400';
            case 'success': return 'text-green-400';
            case 'log': return 'text-cyan-400';
            default: return 'text-dark-text-secondary';
        }
    };
    return (
        <div className="flex items-start text-sm font-mono">
            <span className="text-gray-500 mr-4">{new Date(log.timestamp).toLocaleTimeString()}</span>
            <span className={`flex-shrink-0 mr-4 ${getStatusColor()}`}>{log.type.toUpperCase()}</span>
            <p className="flex-grow whitespace-pre-wrap text-dark-text-primary">{log.message}</p>
        </div>
    );
});

export const LogPanel = ({ logs, status }) => {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const logContainerRef = useRef(null);

    useEffect(() => {
        if (status === ExecutionStatus.RUNNING) {
            setIsCollapsed(false);
        }
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [logs, status]);

    const getStatusIndicator = () => {
        switch (status) {
            case ExecutionStatus.RUNNING:
                return <div className="flex items-center gap-2 text-yellow-400"><svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><span>Running...</span></div>;
            case ExecutionStatus.SUCCESS:
                return <span className="text-green-400">Finished Successfully</span>;
            case ExecutionStatus.FAILED:
                return <span className="text-red-400">Failed</span>;
            default:
                return <span className="text-dark-text-secondary">Idle</span>;
        }
    };
    
    if (status === ExecutionStatus.IDLE && logs.length === 0) {
        return null;
    }

    return (
        <div className={`absolute bottom-0 left-0 right-0 bg-dark-surface/90 backdrop-blur-sm border-t border-dark-border z-30 transition-all duration-300 ${isCollapsed ? 'h-12' : 'h-1/3'}`}>
            <div 
                className="flex items-center justify-between px-4 h-12 cursor-pointer"
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                <div className="flex items-center gap-4">
                    <h3 className="font-bold text-dark-text-primary">Execution Logs</h3>
                    <div className="text-sm font-semibold">{getStatusIndicator()}</div>
                </div>
                <button className="p-1 rounded-full hover:bg-dark-bg">
                    {isCollapsed ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
                </button>
            </div>
            {!isCollapsed && (
                <div ref={logContainerRef} className="h-[calc(100%-3rem)] overflow-y-auto p-4 bg-dark-bg">
                    <div className="space-y-2">
                        {logs.map((log, index) => (
                           <LogLine key={index} log={log} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};