// server/controllers/ai.controller.js - FINAL ROBUST VERSION WITH LOGGING

import asyncHandler from 'express-async-handler';
// We don't need fetch imported explicitly in modern Node.js versions
// import fetch from 'node-fetch'; // Only needed for very old Node versions

// --- AI Chat Handler ---
export const handleAIChat = asyncHandler(async (req, res) => {
  const { query, context } = req.body; // Context includes project title/description

  // 1. Validate Input
  if (!query) {
    res.status(400);
    throw new Error('Query is required for AI chat.');
  }

  // 2. Check API Key (CRITICAL)
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('--- AI Chat Error: GEMINI_API_KEY is missing in .env file ---');
    res.status(500);
    throw new Error('AI service configuration error. API key is missing.');
  }

  // 3. Construct Prompt for Gemini API
  // Combine user query with project context for grounded response
  const systemPrompt = `You are a helpful assistant embedded in Arpit's ECE/AI portfolio. 
    Your goal is to answer questions about specific projects based ONLY on the provided context. 
    Be concise, technical, and focus on explaining the engineering aspects. 
    Do not mention information outside the context. Project Context: 
    Title: ${context?.title || 'Unknown Project'}
    Description: ${context?.description || 'No description provided.'}`;

  const userQuery = `Question about the project: ${query}`;

  // 4. Prepare API Request Payload
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  const payload = {
    contents: [{ parts: [{ text: userQuery }] }],
    // Include system instructions
    systemInstruction: {
        parts: [{ text: systemPrompt }]
    },
    // Optional: Add safety settings if needed
    // safetySettings: [ ... ], 
    // generationConfig: { ... } 
  };

  console.log('--- Sending Request to Gemini API ---'); // DEBUG LOG
  // console.log('API URL:', apiUrl); // Uncomment if needed, but hide key in logs
  console.log('Payload:', JSON.stringify(payload, null, 2)); // DEBUG LOG

  try {
    // 5. Call Gemini API using native fetch
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    console.log('Gemini API Response Status:', response.status); // DEBUG LOG

    // Check for non-OK response status (e.g., 400, 429, 500 from Google)
    if (!response.ok) {
        const errorBody = await response.text(); // Get raw error text
        console.error('--- Gemini API Error Response ---');
        console.error('Status:', response.status);
        console.error('Body:', errorBody);
        res.status(500); // Indicate internal server error originating from external API
        throw new Error(`AI service failed with status ${response.status}. Check server logs for details.`);
    }

    // 6. Parse Successful Response
    const result = await response.json();
    console.log('--- Received Response from Gemini API ---'); // DEBUG LOG
    // console.log('Full Result:', JSON.stringify(result, null, 2)); // Uncomment for deep debug

    // Extract the generated text safely
    const generatedText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
        console.error('--- Gemini API Response Parsing Error ---');
        console.error('Could not find generated text in response:', JSON.stringify(result));
        res.status(500);
        throw new Error('AI service returned an unexpected response format.');
    }

    console.log('Generated Text:', generatedText.substring(0, 100) + '...'); // Log snippet

    // 7. Send Response Back to Frontend
    res.status(200).json({ text: generatedText });

  } catch (error) {
    // Catch fetch errors (network, DNS) or errors thrown above
    console.error('--- AI Chat Controller Error ---');
    console.error(error); // Log the full error
    // Ensure error is passed to the central error handler
    // If res.status wasn't set above, set a generic 500
    if (!res.headersSent) {
        res.status(500);
    }
    // Re-throw for asyncHandler to catch and respond
    throw new Error(error.message || 'Failed to communicate with AI service.'); 
  }
});