import React, { useState, useCallback } from 'react';
import { CloseIcon, DeleteIcon } from './icons';

const CredentialForm = ({ onAddCredential }) => {
    const [name, setName] = useState('');
    const [type, setType] = useState('API_KEY');
    const [data, setData] = useState({ apiKey: '' });

    const handleTypeChange = (e) => {
        const newType = e.target.value;
        setType(newType);
        if (newType === 'API_KEY') {
            setData({ apiKey: '' });
        } else if (newType === 'DATABASE') {
            setData({ host: '', user: '', password: '', database: '' });
        }
    };

    const handleDataChange = (key, value) => {
        setData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        onAddCredential(name, type, data);
        setName('');
        setType('API_KEY');
        setData({ apiKey: '' });
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border border-dark-border rounded-lg bg-dark-bg space-y-4">
            <h3 className="text-lg font-semibold text-dark-text-primary">Add New Credential</h3>
            <div>
                <label className="block text-sm font-medium text-dark-text-secondary mb-1">Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., My Production DB" required className="w-full bg-dark-surface border border-dark-border rounded-md p-2 text-sm text-dark-text-primary focus:ring-1 focus:ring-brand-primary focus:outline-none transition"/>
            </div>
             <div>
                <label className="block text-sm font-medium text-dark-text-secondary mb-1">Type</label>
                <select value={type} onChange={handleTypeChange} className="w-full bg-dark-surface border border-dark-border rounded-md p-2 text-sm text-dark-text-primary focus:ring-1 focus:ring-brand-primary focus:outline-none transition">
                    <option value="API_KEY">API Key</option>
                    <option value="DATABASE">Database</option>
                </select>
            </div>
            {type === 'API_KEY' && (
                <div>
                    <label className="block text-sm font-medium text-dark-text-secondary mb-1">API Key</label>
                    <input type="password" value={data.apiKey || ''} onChange={(e) => handleDataChange('apiKey', e.target.value)} required className="w-full bg-dark-surface border border-dark-border rounded-md p-2 text-sm text-dark-text-primary focus:ring-1 focus:ring-brand-primary focus:outline-none transition"/>
                </div>
            )}
            {type === 'DATABASE' && (
                <>
                    <div>
                        <label className="block text-sm font-medium text-dark-text-secondary mb-1">Host</label>
                        <input type="text" value={data.host || ''} onChange={(e) => handleDataChange('host', e.target.value)} required className="w-full bg-dark-surface border border-dark-border rounded-md p-2 text-sm text-dark-text-primary focus:ring-1 focus:ring-brand-primary focus:outline-none transition"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-dark-text-secondary mb-1">User</label>
                        <input type="text" value={data.user || ''} onChange={(e) => handleDataChange('user', e.target.value)} required className="w-full bg-dark-surface border border-dark-border rounded-md p-2 text-sm text-dark-text-primary focus:ring-1 focus:ring-brand-primary focus:outline-none transition"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-dark-text-secondary mb-1">Password</label>
                        <input type="password" value={data.password || ''} onChange={(e) => handleDataChange('password', e.target.value)} required className="w-full bg-dark-surface border border-dark-border rounded-md p-2 text-sm text-dark-text-primary focus:ring-1 focus:ring-brand-primary focus:outline-none transition"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-dark-text-secondary mb-1">Database</label>
                        <input type="text" value={data.database || ''} onChange={(e) => handleDataChange('database', e.target.value)} required className="w-full bg-dark-surface border border-dark-border rounded-md p-2 text-sm text-dark-text-primary focus:ring-1 focus:ring-brand-primary focus:outline-none transition"/>
                    </div>
                </>
            )}
            <button type="submit" className="w-full py-2 px-4 rounded-md bg-brand-primary text-white font-semibold hover:bg-brand-primary/90 transition-colors">Add Credential</button>
        </form>
    );
};

export const CredentialsModal = ({ isOpen, onClose, credentials, onAddCredential, onDeleteCredential }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center" onClick={onClose}>
            <div className="bg-dark-surface rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b border-dark-border flex-shrink-0">
                    <h2 className="text-xl font-bold text-dark-text-primary">Manage Credentials</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-dark-bg text-dark-text-secondary hover:text-white">
                        <CloseIcon className="w-5 h-5"/>
                    </button>
                </div>
                <div className="flex-grow p-4 overflow-y-auto grid grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-lg font-semibold text-dark-text-primary mb-3">Saved Credentials</h3>
                        {credentials.length === 0 ? (
                            <p className="text-sm text-dark-text-secondary">No credentials saved yet.</p>
                        ) : (
                            <ul className="space-y-2">
                                {credentials.map(cred => (
                                    <li key={cred.id} className="flex items-center justify-between p-2 bg-dark-bg rounded-md">
                                        <div>
                                            <p className="font-medium text-dark-text-primary">{cred.name}</p>
                                            <p className="text-xs text-dark-text-secondary">{cred.type}</p>
                                        </div>
                                        <button onClick={() => onDeleteCredential(cred.id)} className="p-1 text-red-500 hover:text-red-400">
                                            <DeleteIcon className="w-4 h-4"/>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div>
                        <CredentialForm onAddCredential={onAddCredential} />
                    </div>
                </div>
            </div>
        </div>
    );
};