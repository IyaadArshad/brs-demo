import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

async function create_file(file_name: string) {
  console.log(`Creating file: ${file_name}`);
  const response = await fetch("http://localhost:3000/api/data/createFile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ file_name }),
  });
  const responseData = await response.json();
  if (!response.ok) {
    console.error(`Failed to create file: ${response.statusText}`);
    return { success: false, error: responseData.message };
  }
  console.log(`File created successfully: ${file_name}`);
  return responseData;
}

async function write_initial_data(file_name: string, data: string) {
  console.log(`Writing initial data to file: ${file_name}`);
  const response = await fetch(
    "http://localhost:3000/api/data/writeInitialData",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ file_name, data }),
    }
  );
  const responseData = await response.json();
  if (!response.ok) {
    console.error(`Failed to write initial data: ${response.statusText}`);
    return { success: false, error: responseData.message };
  }
  console.log(`Initial data written successfully to file: ${file_name}`);
  return responseData;
}

async function get_implementation_details(user_inputs: string, file_name: string) {
  console.log(`Getting implementation details for input: ${user_inputs}`);
  const response = await fetch("http://localhost:3000/api/generative/get_overview", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input: user_inputs, file_name: file_name }),
  });
  const responseData = await response.json();
  if (!response.ok) {
    console.error(`Failed to get implementation details: ${response.statusText}`);
    return { success: false, error: responseData.message };
  }
  console.log(`Implementation details received for input: ${user_inputs}`);
  return responseData;
}

async function implement_overview(overview: string, file_name: string) {
  console.log(`Implementing overview for file: ${file_name}`);
  const response = await fetch("http://localhost:3000/api/generative/implement_overview", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      overview: overview,
      file_name: file_name
     }),
  });

  const responseData = await response.json();
  if (!response.ok) {
    console.error(`Failed to implement overview: ${response.statusText}`);
    return { success: false, error: responseData.message };
  }
  console.log(`Overview implemented successfully for file: ${file_name}`);
  return responseData;
}

async function read_file(file_name: string) {
  console.log(`Reading file: ${file_name}`);
  const response = await fetch(`http://localhost:3000/api/data/readFile?file_name=${file_name}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const responseData = await response.json();
  if (!response.ok) {
    console.error(`Failed to read file: ${response.statusText}`);
    return { success: false, error: responseData.message };
  }
  console.log(`File read successfully: ${file_name}`);
  return responseData;
}

export async function POST(request: Request) {
  try {
    console.log("Received POST request");
    const { messages: userMessages } = await request.json();
    console.log("User messages:", userMessages);

    const functionCallLogs: { name: string; arguments: any }[] = [];

    type Message =
      | { role: "system" | "user"; content: string }
      | { role: "function"; name: string; content: string };

    let conversation: Message[] = [
      {
      role: "system",
      content:
        'You are ChatGPT, but modified to work as a Business Requirements Specification (BRS) AI Agent. You have functions do perform your tasks. You will use this prompt to understand how to create BRS documents. You can create_file to create a document. You will also provide the input for write_initial_data. BRS Documents are just .md files. You must create a file first, but you cannot do anything with the document. You must first write some initial data to the document. You will only write the initial data as long as you have the information you need for at least one screen. DO NOT EVER DIRECTLY PUT MARKDOWN TO THE USER. ONLY USE FUNCTIONS. If you want to update the content of the document, it is a different process, you must first get an overview of how you must implement the requested changes. Use get_implementation_details and put all the inputs that the user has put so far regarding a specific change. Put appropriate context in the user_inputs parameter and put the file the user is referring to in file_name. Please only work on one document in a conversation  only. Once you get an overview, you will remember what the overview was and directly give that overview to implement_overview function to implement the requested changes. Then the document will be updated. Once that is done, you will directly give the implementation details to the user in the message, without making any changes. If the user tries to generate a BRS in one message, Let the user know that creating a BRS effectively cannot be done in one message and let them know that they can ask you for questions for writing out data for each screen, and you can make it detailed with their input. Creating a Business Requirements Specification (BRS) document in markdown can be done using a document title at the beginning. Start with a concise, simple H1 title (#) that uses 4-5 words (Example: MIS Control Module), it should sound professional, next, an BRS really just consists of different screens. Most BRS\'s have more than 10 screens - that\'s alot! You will only do what the user has asked you to do, if the user is vague, you must ask questions until you can accurately create the rest of the BRS, you may provide suggestions to the user on potential screens to add. Only add screens to the document if the user has instructed you to do it. Do not be afraid to ask for clarifications or further detail. If the user puts alot of screens in one message, you will remember all the user says as context and proceed slowly step by step. Think carefully about what the user has asked about, ask the user for any missing details and if you feel like you have to assume something, you must ask the user. You have to be as clear as possible in an BRS.  For your reference, here is what a BRS is like: "At the topmost section of the document, there is the main heading. A simple, concise H1 title (#) that is 4-5 words (Example: MIS Control Module). A BRS is just a document that consists of different screens. Each screen has 4 sections. The first is the H2 (##) Heading that is the name of the screen. It is numbered, so the heading is prefixed with a 1. or 2. or 3. etc. It is a short 2-6 word of what the title does. If the screen is part of a larger screen (by context), the current smaller section is in brackets. Think carefully about using this. This would be like the users page, but the current screen is that of a new transaction, this would be "Users (New User)", other examples include "Sales (List View)", "Sales Manager (New Transaction)" etc. The second part of a screen is some extra information. It is usually a simple sentence explaining the screen. Use casual language for this one, but don\'t be unprofessional. usually simple language that gets the point across. This doesn\'t always need to be there. Most of the time, this second section isn\'t there anyway. Just keep in mind this exists though. The third section is the diagram. The fourth and last section of every screen is the extra data. There will always be some for of a short 1-2  sentence description in 1 or 2 lines.  This could be adding a table for some same data, tables to specify form field types, bullet points for extra info, etc.  Remember the format of the BRS markdown correctly as outlined above. Strictly follow this." You may create a file with some info, but you must have obtained information for at least one of the screens that the user has requested, and you may keep updating the file after each screen designed if the user is designing screens one by one. You will not use bullet points to display lists with 1 item or less. Never use the word description or title with a colon to state the title or description. That is implicit with the heading, subheading, and paragraph format outlined here. Remember to use the format of the BRS markdown correctly as outlined above. Do not talk, discuss or do anything related to anything too far outside context of the brs. Never display the brs diagram placeholder or any other markdown elements directly to the user in your assistant response EVER. all markdown, document elements and diagrams belong in the files you create and update. NEVER SHOW PREVIEWS OF YOUR BRS FILES. NEVER PUT BRS ELEMENTS IN YOUR RESPONSE.',
      },
      ...userMessages,
    ];

    while (true) {
      console.log("Sending conversation to OpenAI:", conversation);
      const openAiResponse = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: conversation,
            functions: [
              {
                name: "create_brs_file",
                description: "Creates a .md file for the BRS document",
                parameters: {
                  type: "object",
                  required: ["file_name"],
                  properties: {
                    file_name: { type: "string" },
                  },
                },
              },
              {
                name: "get_implementation_details",
                description: "Gets an overview for changes that need to be implemented for a document",
                parameters: {
                  type: "object",
                  required: ["user_inputs", "file_name"],
                  properties: {
                    user_inputs: { type: "string" },
                    file_name: { type: "string" }
                  },
                },
              },
              {
                name: "implement_overview",
                description: "Using the implementation overview obtained from get_implement_details, this makes the changes to the document",
                parameters: {
                  type: "object",
                  required: ["user_inputs", "file_name"],
                  properties: {
                    user_inputs: { type: "string" },
                    file_name: { type: "string"}
                  },
                },
              },
              {
                name: "write_initial_data",
                description:
                  "Writes initial data for version one for a file. You must call this to write initial data to a .md BRS file",
                parameters: {
                  type: "object",
                  required: ["file_name", "data"],
                  properties: {
                    data: { type: "string" },
                    file_name: { type: "string" },
                  },
                },
              }
            ],
            function_call: "auto",
            temperature: 1.37,
            max_completion_tokens: 10000,
            top_p: 0.68,
            frequency_penalty: 0.35,
            presence_penalty: 0,
            stream: false,
          }),
        }
      );

      if (!openAiResponse.ok) {
        const errorText = await openAiResponse.text();
        console.error(`OpenAI error: ${errorText}`);
        throw new Error(`OpenAI error: ${errorText}`);
      }

      const openAiResult = await openAiResponse.json();
      const message = openAiResult.choices[0].message;
      console.log("Received message from OpenAI:", message);
      conversation.push(message);

      if (message.function_call) {
        const { name, arguments: args } = message.function_call;
        const functionArgs = JSON.parse(args);
        console.log(
          `Executing function call: ${name} with args:`,
          functionArgs
        );

        functionCallLogs.push({ name, arguments: functionArgs });

        let functionResult;

        if (name === "create_brs_file") {
          functionResult = await create_file(functionArgs.file_name);
        } else if (name === "write_initial_data") {
          functionResult = await write_initial_data(
            functionArgs.file_name,
            functionArgs.data
          );
        } else if (name === "implement_overview") {
          functionResult = await implement_overview(
            functionArgs.overview,
            functionArgs.file_name
          );
        } else if (name === "get_implementation_details") {
          functionResult = await get_implementation_details(
            functionArgs.user_inputs,
            functionArgs.file_name
          );
        } else if (name === "read_file") {
          functionResult = await read_file(
            functionArgs.file_name
          );
        } else {
          console.error(`Function ${name} not found.`);
          throw new Error(`Function ${name} not found.`);
        }

        console.log(`Function result: ${name}`, functionResult);
        conversation.push({
          role: "function",
          name,
          content: JSON.stringify(functionResult),
        });
      } else {
        console.log("No function call, streaming final text to client");
        const text = message.content || "";
        const words = text.split(/\s+/);
        const encoder = new TextEncoder();

        const readable = new ReadableStream({
          async start(controller) {
            for (const word of words) {
              const chunk = {
                id: `chatcmpl-${crypto.randomUUID()}`,
                object: "chat.completion.chunk",
                created: Math.floor(Date.now() / 1000),
                model: "gpt-4o-mini-2024-07-18",
                service_tier: "default",
                system_fingerprint: "fp_01aeff40ea",
                choices: [
                  {
                    index: 0,
                    delta: { content: `${word} ` },
                    logprobs: null,
                    finish_reason: null,
                  },
                ],
              };
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`)
              );
              await new Promise((resolve) => setTimeout(resolve, 10));
            }

            const functionLogsMessage = {
              functionsCalled: functionCallLogs,
            };
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify(functionLogsMessage)}\n\n`
              )
            );

            controller.close();
          },
        });

        const streamingResponse = new Response(readable, {
          headers: { "Content-Type": "text/event-stream" },
        });

        if (!streamingResponse.body) {
          console.error("No streaming body found.");
          throw new Error("No streaming body found.");
        }

        console.log("Streaming response to client");
        return new Response(streamingResponse.body, {
          headers: { "Content-Type": "text/event-stream" },
        });
      }
    }
  } catch (err) {
    console.error("Error in POST handler:", err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}