import { GoogleGenAI, Type } from "@google/genai";
import { NodeType } from '../types.js';

// Use REACT_APP_ prefix for environment variables in Create React App
const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
if (!API_KEY) {
  throw new Error("REACT_APP_GEMINI_API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const availableNodeTypes = Object.values(NodeType);

const workflowSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      type: {
        type: Type.STRING,
        enum: availableNodeTypes,
        description: 'The type of the workflow node.',
      },
      label: {
        type: Type.STRING,
        description: 'A concise, user-friendly label for what this node does.',
      },
    },
    required: ['type', 'label'],
  },
};

const singleNodeSchema = {
    type: Type.OBJECT,
    properties: {
        type: {
            type: Type.STRING,
            enum: availableNodeTypes,
            description: 'The single most appropriate node type for the user request.'
        },
        label: {
            type: Type.STRING,
            description: 'A concise, user-friendly label for what this node does.'
        }
    },
    required: ['type', 'label']
};

export async function generateWorkflowFromPrompt(prompt) {
  const fullPrompt = `
    You are an expert business process automation assistant.
    Based on the user's request, generate a logical sequence of workflow steps.
    The available step types are: ${availableNodeTypes.join(', ')}.
    Your response must be a JSON array of objects, strictly following the provided schema.
    Each object in the array represents one step in the workflow.

    User Request: "${prompt}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: workflowSchema,
      },
    });

    const jsonString = response.text.trim();
    const parsedResponse = JSON.parse(jsonString);

    if (!Array.isArray(parsedResponse)) {
      throw new Error("AI response is not a valid array.");
    }
    
    // Validate the structure of the parsed response
    const validatedResponse = parsedResponse.filter(item => 
      item && typeof item === 'object' && 'type' in item && 'label' in item && availableNodeTypes.includes(item.type)
    );

    if (validatedResponse.length === 0 && parsedResponse.length > 0) {
        throw new Error("AI response contained invalid node types.");
    }

    return validatedResponse;
  } catch (error) {
    console.error("Error generating workflow from prompt:", error);
    throw new Error("Failed to communicate with the AI model.");
  }
}

export async function generateNodeFromPrompt(prompt) {
    const fullPrompt = `
        You are an expert business process automation assistant.
        Analyze the user's request and choose the single best workflow node type to accomplish it.
        The available node types are: ${availableNodeTypes.join(', ')}.
        Your response must be a single JSON object, strictly following the provided schema.

        User Request: "${prompt}"
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: singleNodeSchema,
            },
        });

        const jsonString = response.text.trim();
        const parsedResponse = JSON.parse(jsonString);

        if (parsedResponse && typeof parsedResponse === 'object' && 'type' in parsedResponse && 'label' in parsedResponse && availableNodeTypes.includes(parsedResponse.type)) {
            return parsedResponse;
        } else {
            throw new Error("AI response did not match the required schema.");
        }
    } catch (error) {
        console.error("Error generating node from prompt:", error);
        throw new Error("Failed to communicate with the AI model.");
    }
}