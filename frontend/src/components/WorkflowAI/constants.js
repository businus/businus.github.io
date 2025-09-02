import React from 'react';
import { NodeType } from './types.js';
import { TriggerIcon, SendEmailIcon, GenerateDocumentIcon, FileTaxesIcon, UpdateCrmIcon, SocialPostIcon, WaitIcon, IfConditionIcon, LoopStartIcon, LoopEndIcon, CodeIcon, DatabaseIcon, ApiIcon, LoggerIcon, BrowsingAgentIcon, RegisterBusinessIcon, ExpandBusinessIcon, DashboardIcon, CreateWebsiteIcon, ManageInvoicesIcon, MarketResearchIcon, ComplianceCheckIcon, HireEmployeeIcon } from './components/icons';

export const NODE_WIDTH = 208; // Corresponds to w-52 class
export const NODE_HEIGHT = 80; // Corresponds to h-20 class

export const NODE_TYPES = {
  [NodeType.TRIGGER]: {
    type: NodeType.TRIGGER,
    label: 'Trigger',
    icon: <TriggerIcon className="w-6 h-6" />,
    defaultData: { condition: 'On New User Signup' },
    description: 'Starts the workflow based on an event.'
  },
  [NodeType.SEND_EMAIL]: {
    type: NodeType.SEND_EMAIL,
    label: 'Send Email',
    icon: <SendEmailIcon className="w-6 h-6" />,
    defaultData: { to: '{{user.email}}', subject: 'Welcome!', body: 'Hello {{user.name}}!' },
    description: 'Sends a transactional or marketing email.'
  },
  [NodeType.GENERATE_DOCUMENT]: {
    type: NodeType.GENERATE_DOCUMENT,
    label: 'Generate Document',
    icon: <GenerateDocumentIcon className="w-6 h-6" />,
    defaultData: { template: 'contract.docx', format: 'pdf' },
    description: 'Creates a document from a template.'
  },
  [NodeType.IF_CONDITION]: {
    type: NodeType.IF_CONDITION,
    label: 'If/Else Condition',
    icon: <IfConditionIcon className="w-6 h-6" />,
    defaultData: { condition: '{{user.isSubscribed}} == true' },
    description: 'Splits the workflow based on a condition.'
  },
    [NodeType.LOOP_START]: {
    type: NodeType.LOOP_START,
    label: 'Start Loop',
    icon: <LoopStartIcon className="w-6 h-6" />,
    defaultData: { condition: '{{item.status}} !== "processed"' },
    description: 'Repeats steps while a condition is true.',
  },
  [NodeType.LOOP_END]: {
    type: NodeType.LOOP_END,
    label: 'End Loop',
    icon: <LoopEndIcon className="w-6 h-6" />,
    defaultData: {},
    description: 'Marks the end of a loop iteration.',
  },
  [NodeType.CODE]: {
    type: NodeType.CODE,
    label: 'Code',
    icon: <CodeIcon className="w-6 h-6" />,
    defaultData: { code: 'console.log("Hello, World!");\nreturn { success: true };' },
    description: 'Execute custom JavaScript code.'
  },
  [NodeType.QUERY_DATABASE]: {
    type: NodeType.QUERY_DATABASE,
    label: 'Query Database',
    icon: <DatabaseIcon className="w-6 h-6" />,
    defaultData: { credentialId: '', query: 'SELECT * FROM users LIMIT 10;' },
    description: 'Run a query against your database.'
  },
  [NodeType.CONNECT_API]: {
    type: NodeType.CONNECT_API,
    label: 'Connect to API',
    icon: <ApiIcon className="w-6 h-6" />,
    defaultData: { credentialId: '', method: 'GET', url: 'https://api.example.com/data', headers: '{\n  "Content-Type": "application/json"\n}', body: '{\n  "key": "value"\n}' },
    description: 'Make an HTTP request to an external API.'
  },
  [NodeType.LOGGER]: {
    type: NodeType.LOGGER,
    label: 'Logger',
    icon: <LoggerIcon className="w-6 h-6" />,
    defaultData: { message: 'Log: {{ some_variable }}' },
    description: 'Logs a message for debugging purposes.'
  },
  [NodeType.BROWSING_AGENT]: {
    type: NodeType.BROWSING_AGENT,
    label: 'Browsing Agent',
    icon: <BrowsingAgentIcon className="w-6 h-6" />,
    defaultData: { url: 'https://example.com', task: 'Summarize the main content.' },
    description: 'Automates tasks on a website.'
  },
  [NodeType.REGISTER_BUSINESS]: {
    type: NodeType.REGISTER_BUSINESS,
    label: 'Register Business',
    icon: <RegisterBusinessIcon className="w-6 h-6" />,
    defaultData: { businessName: 'My NewCo', businessType: 'LLC', country: 'USA' },
    description: 'Registers a new business entity.'
  },
  [NodeType.EXPAND_BUSINESS]: {
    type: NodeType.EXPAND_BUSINESS,
    label: 'Expand Business',
    icon: <ExpandBusinessIcon className="w-6 h-6" />,
    defaultData: { strategy: 'Launch marketing in new region' },
    description: 'Creates a plan to expand business operations.'
  },
  [NodeType.DASHBOARD]: {
    type: NodeType.DASHBOARD,
    label: 'Dashboard',
    icon: <DashboardIcon className="w-6 h-6" />,
    defaultData: { chartType: 'Bar', data: '{{query_result}}' },
    description: 'Visualizes data from other workflow steps.'
  },
  [NodeType.CREATE_WEBSITE]: {
    type: NodeType.CREATE_WEBSITE,
    label: 'Create Website',
    icon: <CreateWebsiteIcon className="w-6 h-6" />,
    defaultData: { siteName: 'My Awesome Site', businessType: 'E-commerce', template: 'Modern' },
    description: 'Automates the creation of a business website.'
  },
  [NodeType.MANAGE_INVOICES]: {
    type: NodeType.MANAGE_INVOICES,
    label: 'Manage Invoices',
    icon: <ManageInvoicesIcon className="w-6 h-6" />,
    defaultData: { action: 'Create', client: 'Client Name', amount: 1000, currency: 'USD' },
    description: 'Create, send, or track invoices.'
  },
  [NodeType.MARKET_RESEARCH]: {
    type: NodeType.MARKET_RESEARCH,
    label: 'Market Research',
    icon: <MarketResearchIcon className="w-6 h-6" />,
    defaultData: { topic: 'Competitor analysis for SaaS products', market: 'Global' },
    description: 'Uses AI to perform market research.'
  },
  [NodeType.COMPLIANCE_CHECK]: {
    type: NodeType.COMPLIANCE_CHECK,
    label: 'Compliance Check',
    icon: <ComplianceCheckIcon className="w-6 h-6" />,
    defaultData: { checkType: 'GDPR', region: 'EU' },
    description: 'Checks for business compliance in a region.'
  },
  [NodeType.HIRE_EMPLOYEE]: {
    type: NodeType.HIRE_EMPLOYEE,
    label: 'Hire Employee',
    icon: <HireEmployeeIcon className="w-6 h-6" />,
    defaultData: { role: 'Software Engineer', status: 'Send Offer Letter' },
    description: 'Automates steps in the hiring process.'
  },
  [NodeType.FILE_TAXES]: {
    type: NodeType.FILE_TAXES,
    label: 'File Taxes',
    icon: <FileTaxesIcon className="w-6 h-6" />,
    defaultData: { country: 'USA', year: new Date().getFullYear(), form: '1040' },
    description: 'Prepares and files tax documents.'
  },
  [NodeType.UPDATE_CRM]: {
    type: NodeType.UPDATE_CRM,
    label: 'Update CRM',
    icon: <UpdateCrmIcon className="w-6 h-6" />,
    defaultData: { record: '{{user.id}}', status: 'Onboarded' },
    description: 'Updates a record in your CRM.'
  },
  [NodeType.SOCIAL_POST]: {
    type: NodeType.SOCIAL_POST,
    label: 'Social Post',
    icon: <SocialPostIcon className="w-6 h-6" />,
    defaultData: { platform: 'Twitter', content: 'Welcome our new client!', targetAudience: 'Global' },
    description: 'Posts a message to a social media platform.'
  },
  [NodeType.WAIT]: {
    type: NodeType.WAIT,
    label: 'Wait',
    icon: <WaitIcon className="w-6 h-6" />,
    defaultData: { duration: '1', unit: 'days' },
    description: 'Pauses the workflow for a set duration.'
  },
};