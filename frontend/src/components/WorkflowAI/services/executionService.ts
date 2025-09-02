import { WorkflowNode, Edge, Credential, NodeType, ExecutionStatus, ExecutionContext, ExecutionLog } from '../types';

interface ExecuteWorkflowParams {
    nodes: WorkflowNode[];
    edges: Edge[];
    credentials: Credential[];
    onLog: (log: ExecutionLog) => void;
    onSetActiveNode: (nodeId: string | null) => void;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function resolveTemplate(template: string, context: ExecutionContext): string {
    return template.replace(/\{\{([^}]+)\}\}/g, (_, path) => {
        const parts = path.trim().split('.');
        let current: any = context;
        for (const part of parts) {
            if (current && typeof current === 'object' && part in current) {
                current = current[part];
            } else {
                return `{{${path}}}`; // Return original if path not found
            }
        }
        return typeof current === 'object' ? JSON.stringify(current) : current;
    });
}


export async function executeWorkflow({ nodes, edges, credentials, onLog, onSetActiveNode }: ExecuteWorkflowParams): Promise<ExecutionStatus> {
    const context: ExecutionContext = {};
    const nodeMap = new Map(nodes.map(n => [n.id, n]));

    const log = (nodeId: string | null, message: string, type: ExecutionLog['type'] = 'info') => {
        onLog({ timestamp: new Date().toISOString(), nodeId, message, type });
    };

    try {
        log(null, 'Workflow execution started.');
        
        let currentNodeId: string | null = nodes.find(n => n.type === NodeType.TRIGGER)?.id || null;

        if (!currentNodeId) {
            throw new Error('No TRIGGER node found to start the workflow.');
        }

        while (currentNodeId) {
            onSetActiveNode(currentNodeId);
            const node = nodeMap.get(currentNodeId);
            if (!node) {
                throw new Error(`Node with ID ${currentNodeId} not found.`);
            }

            log(node.id, `Executing node: ${node.label} (${node.type})`);
            
            let output: any = null;
            let nextNodeId: string | null = null;
            let nextSourceHandle: Edge['sourceHandle'] | undefined = undefined;

            // Resolve templates for all data fields
            const resolvedData: { [key: string]: any } = {};
            for (const key in node.data) {
                if (typeof node.data[key] === 'string') {
                    resolvedData[key] = resolveTemplate(node.data[key], context);
                } else {
                    resolvedData[key] = node.data[key];
                }
            }

            switch (node.type) {
                case NodeType.TRIGGER:
                    output = { message: 'Workflow triggered', timestamp: new Date().toISOString(), user: { name: 'John Doe', email: 'john.doe@example.com', isSubscribed: true } };
                    log(node.id, 'Trigger activated with mock data.');
                    break;
                
                case NodeType.WAIT:
                    const duration = parseFloat(resolvedData.duration || '1');
                    const unit = resolvedData.unit || 'seconds';
                    let ms = duration * 1000;
                    if (unit === 'minutes') ms *= 60;
                    if (unit === 'hours') ms *= 60 * 60;
                    if (unit === 'days') ms *= 60 * 60 * 24;
                    log(node.id, `Waiting for ${duration} ${unit}...`);
                    await delay(ms);
                    output = { waited: `${duration} ${unit}` };
                    break;

                case NodeType.SEND_EMAIL:
                    log(node.id, `Simulating sending email to: ${resolvedData.to} with subject: ${resolvedData.subject}`);
                    output = { status: 'sent', recipient: resolvedData.to };
                    break;

                case NodeType.LOGGER:
                    log(node.id, resolvedData.message, 'log');
                    output = { loggedMessage: resolvedData.message };
                    break;

                case NodeType.CODE:
                    try {
                        const code = `
                            return (async (context) => {
                                ${node.data.code}
                            })(context);
                        `;
                        const func = new Function('context', code);
                        output = await func(context);
                        log(node.id, `Code executed successfully. Output: ${JSON.stringify(output)}`);
                    } catch (e) {
                        throw new Error(`Error in CODE node: ${(e as Error).message}`);
                    }
                    break;

                case NodeType.IF_CONDITION:
                    // This is a mock evaluation. A real implementation would need a secure sandbox.
                    const condition = resolvedData.condition.toLowerCase();
                    let result = false;
                    if (condition.includes('==') || condition.includes('is')) {
                        result = condition.includes('true');
                    }
                    log(node.id, `Condition "${resolvedData.condition}" evaluated to: ${result}`);
                    nextSourceHandle = result ? 'true' : 'false';
                    output = { result };
                    break;

                case NodeType.LOOP_START:
                    log(node.id, "Looping is not yet supported in execution.", 'info');
                    // For now, we just exit the loop path
                    nextSourceHandle = 'afterLoop';
                    output = { status: 'skipped' };
                    break;
                
                // Mock execution for other nodes
                case NodeType.GENERATE_DOCUMENT:
                case NodeType.FILE_TAXES:
                case NodeType.UPDATE_CRM:
                case NodeType.SOCIAL_POST:
                case NodeType.QUERY_DATABASE:
                case NodeType.CONNECT_API:
                case NodeType.BROWSING_AGENT:
                case NodeType.REGISTER_BUSINESS:
                case NodeType.EXPAND_BUSINESS:
                case NodeType.DASHBOARD:
                case NodeType.CREATE_WEBSITE:
                case NodeType.MANAGE_INVOICES:
                case NodeType.MARKET_RESEARCH:
                case NodeType.COMPLIANCE_CHECK:
                case NodeType.HIRE_EMPLOYEE:
                    log(node.id, `Simulating action for ${node.type}.`);
                    output = { status: 'simulated_success' };
                    break;

                default:
                     output = { status: 'no_op' };
            }
            
            context[node.id] = { output };
            
            // Find next node
            if (node.type === NodeType.LOOP_END) {
                 // Should find corresponding LOOP_START and evaluate condition. Not implemented.
                 nextNodeId = null;
            } else {
                const nextEdge = edges.find(e => e.source === currentNodeId && e.sourceHandle === nextSourceHandle);
                nextNodeId = nextEdge?.target || null;
            }
            
            // If there's no specific next node from a handle, try the default output
            if (!nextNodeId && node.type !== NodeType.IF_CONDITION && node.type !== NodeType.LOOP_START) {
                const defaultEdge = edges.find(e => e.source === currentNodeId && !e.sourceHandle);
                nextNodeId = defaultEdge?.target || null;
            }
            
            currentNodeId = nextNodeId;

            // Small delay for visualization
            if (currentNodeId) await delay(300);
        }

        log(null, 'Workflow execution finished successfully.', 'success');
        return ExecutionStatus.SUCCESS;
    } catch (error) {
        const errorMessage = (error as Error).message;
        log(null, `Workflow execution failed: ${errorMessage}`, 'error');
        return ExecutionStatus.FAILED;
    } finally {
        onSetActiveNode(null);
    }
}