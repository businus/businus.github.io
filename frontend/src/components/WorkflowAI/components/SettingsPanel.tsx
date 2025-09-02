import React from 'react';
import { WorkflowNode, NodeData, Credential, CredentialType, NodeType } from '../types';
import { NODE_TYPES } from '../constants';
import { CloseIcon, KeyIcon } from './icons';

interface SettingsPanelProps {
  node: WorkflowNode | null;
  selectedCount: number;
  onClose: () => void;
  onUpdate: (nodeId: string, updates: Partial<Omit<WorkflowNode, 'id' | 'position' | 'type'>>) => void;
  credentials: Credential[];
  onOpenCredentialsModal: () => void;
}

const SettingsInput: React.FC<{ label: string; value: any; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; isTextarea?: boolean }> = ({ label, value, onChange, isTextarea }) => (
    <div>
        <label className="block text-sm font-medium text-dark-text-secondary mb-1">{label}</label>
        {isTextarea ? (
             <textarea value={value} onChange={onChange} rows={8} className="w-full bg-dark-bg border border-dark-border rounded-md p-2 text-sm text-dark-text-primary focus:ring-1 focus:ring-brand-primary focus:outline-none transition font-mono"/>
        ) : (
             <input type="text" value={value} onChange={onChange} className="w-full bg-dark-bg border border-dark-border rounded-md p-2 text-sm text-dark-text-primary focus:ring-1 focus:ring-brand-primary focus:outline-none transition"/>
        )}
    </div>
);

const CredentialSelector: React.FC<{
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    credentials: Credential[];
    type: CredentialType;
}> = ({ value, onChange, credentials, type }) => {
    const filteredCredentials = credentials.filter(c => c.type === type);
    return (
        <div>
            <label className="block text-sm font-medium text-dark-text-secondary mb-1">Credential</label>
            <select 
                value={value} 
                onChange={onChange}
                className="w-full bg-dark-bg border border-dark-border rounded-md p-2 text-sm text-dark-text-primary focus:ring-1 focus:ring-brand-primary focus:outline-none transition"
            >
                <option value="">Select a credential...</option>
                {filteredCredentials.map(cred => (
                    <option key={cred.id} value={cred.id}>{cred.name}</option>
                ))}
            </select>
        </div>
    );
};

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ node, selectedCount, onClose, onUpdate, credentials, onOpenCredentialsModal }) => {
  if (selectedCount > 1) {
    return (
      <aside className="w-80 bg-dark-surface border-l border-dark-border flex-shrink-0 p-6 flex items-center justify-center text-center">
        <div>
            <p className="font-bold text-lg text-dark-text-primary">{selectedCount} nodes selected</p>
            <p className="text-sm text-dark-text-secondary mt-2">Multi-edit is not supported. Please select a single node to view its settings.</p>
        </div>
      </aside>
    );
  }

  if (!node) {
    return (
      <aside className="w-80 bg-dark-surface border-l border-dark-border flex-shrink-0 p-6 flex items-center justify-center text-center">
          <p className="text-dark-text-secondary">Select a node to view its settings.</p>
      </aside>
    );
  }

  const nodeInfo = NODE_TYPES[node.type];
  
  const handleDataChange = (key: string, value: any) => {
    onUpdate(node.id, { data: { ...node.data, [key]: value } });
  };

  const renderDataFields = () => {
    return Object.entries(node.data).map(([key, value]) => {
        const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
        
        if (key === 'credentialId') {
            let requiredType: CredentialType | null = null;
            if (node.type === NodeType.CONNECT_API) requiredType = CredentialType.API_KEY;
            if (node.type === NodeType.QUERY_DATABASE) requiredType = CredentialType.DATABASE;

            if (requiredType) {
                return <CredentialSelector key={key} value={value} onChange={(e) => handleDataChange(key, e.target.value)} credentials={credentials} type={requiredType} />
            }
        }

        if (key === 'method') {
            return (
                <div key={key}>
                    <label className="block text-sm font-medium text-dark-text-secondary mb-1">{label}</label>
                    <select 
                        value={value} 
                        onChange={(e) => handleDataChange(key, e.target.value)}
                        className="w-full bg-dark-bg border border-dark-border rounded-md p-2 text-sm text-dark-text-primary focus:ring-1 focus:ring-brand-primary focus:outline-none transition"
                    >
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                        <option value="PATCH">PATCH</option>
                    </select>
                </div>
            );
        }

        return (
          <SettingsInput 
              key={key}
              label={label}
              value={value}
              onChange={(e) => handleDataChange(key, e.target.value)}
              isTextarea={['body', 'content', 'code', 'query', 'headers'].includes(key)}
          />
        );
    });
  };

  return (
    <aside className="w-80 bg-dark-surface border-l border-dark-border flex-shrink-0 p-6 z-20 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-brand-secondary">{nodeInfo.icon}</span>
          <h3 className="text-lg font-bold text-dark-text-primary">{node.label}</h3>
        </div>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-dark-bg text-dark-text-secondary hover:text-white">
          <CloseIcon className="w-5 h-5"/>
        </button>
      </div>

      <div className="flex-grow overflow-y-auto space-y-4 -mr-2 pr-2">
        <SettingsInput 
            label="Node Label" 
            value={node.label} 
            onChange={(e) => onUpdate(node.id, { label: e.target.value })}
        />
        {renderDataFields()}
      </div>

      <div className="flex-shrink-0 pt-4 mt-4 border-t border-dark-border">
          <button 
            onClick={onOpenCredentialsModal}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md bg-dark-bg border border-dark-border text-dark-text-secondary hover:text-white hover:border-brand-secondary transition-colors"
          >
            <KeyIcon className="w-5 h-5" />
            <span>Manage Credentials</span>
          </button>
      </div>
    </aside>
  );
};