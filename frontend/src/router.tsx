import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Root } from './routes/root.tsx';
import Index from './routes/index.tsx';
import WorkflowAiRoute from './routes/workflow-ai.tsx';
import PitchDeck from './components/PitchDeck/PitchDeck.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: 'workflow-ai',
        element: <WorkflowAiRoute />,
      },
      {
        path: 'pitch-deck',
        element: <PitchDeck />,
      },
    ],
  },
]);

export default router;