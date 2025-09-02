export enum NodeType {
  TRIGGER = 'TRIGGER',
  SEND_EMAIL = 'SEND_EMAIL',
  GENERATE_DOCUMENT = 'GENERATE_DOCUMENT',
  FILE_TAXES = 'FILE_TAXES',
  UPDATE_CRM = 'UPDATE_CRM',
  SOCIAL_POST = 'SOCIAL_POST',
  WAIT = 'WAIT',
  IF_CONDITION = 'IF_CONDITION',
  LOOP_START = 'LOOP_START',
  LOOP_END = 'LOOP_END',
  CODE = 'CODE',
  QUERY_DATABASE = 'QUERY_DATABASE',
  CONNECT_API = 'CONNECT_API',
  LOGGER = 'LOGGER',
  BROWSING_AGENT = 'BROWSING_AGENT',
  REGISTER_BUSINESS = 'REGISTER_BUSINESS',
  EXPAND_BUSINESS = 'EXPAND_BUSINESS',
  DASHBOARD = 'DASHBOARD',
  CREATE_WEBSITE = 'CREATE_WEBSITE',
  MANAGE_INVOICES = 'MANAGE_INVOICES',
  MARKET_RESEARCH = 'MARKET_RESEARCH',
  COMPLIANCE_CHECK = 'COMPLIANCE_CHECK',
  HIRE_EMPLOYEE = 'HIRE_EMPLOYEE',
}

export interface NodeData {
  [key: string]: any;
}

export interface WorkflowNode {
  id: string;
  type: NodeType;
  label: string;
  position: { x: number; y: number };
  data: NodeData;
  warnings?: string[];
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: 'true' | 'false' | 'loopBody' | 'afterLoop';
}

export interface NodeGroup {
  id: string;
  label: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  nodeIds: string[];
  isCollapsed: boolean;
  color: string;
}

export enum CredentialType {
    API_KEY = 'API_KEY',
    DATABASE = 'DATABASE',
}

export interface Credential {
    id: string;
    name: string;
    type: CredentialType;
    data: { [key: string]: string };
}

export enum ExecutionStatus {
    IDLE = 'IDLE',
    RUNNING = 'RUNNING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
}

export interface ExecutionLog {
    timestamp: string;
    nodeId: string | null;
    message: string;
    type: 'info' | 'error' | 'success' | 'log';
}

export type ExecutionContext = Record<string, { output: any }>;