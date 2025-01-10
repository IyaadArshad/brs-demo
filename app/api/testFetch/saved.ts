import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

async function createFile(file_name: string) {
  console.log(`Creating file: ${file_name}`);
  const response = await fetch("http://localhost:3000/api/data/createFile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ file_name }),
  });
  if (!response.ok) {
    console.error(`Failed to create file: ${response.statusText}`);
    return { success: false, error: response.statusText };
  }
  return await response.json();
}

async function write_initial_data(file_name: string, data: string) {
  console.log(`Writing initial data to file: ${file_name}`);
  const response = await fetch("http://localhost:3000/api/data/writeInitialData", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ file_name, data }),
  });
  if (!response.ok) {
    console.error(`Failed to write initial data: ${response.statusText}`);
    return { success: false, error: response.statusText };
  }
  return await response.json();
}

async function update_markdown_file(file_name: string, data: string) {
  console.log(`Updating markdown file: ${file_name}`);
  const response = await fetch("http://localhost:3000/api/data/updateFile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ file_name, data }),
  });
  if (!response.ok) {
    console.error(`Failed to update markdown file: ${response.statusText}`);
    return { success: false, error: response.statusText };
  }
  return await response.json();
}

async function check_init(file_name: string) {
  console.log(`Checking if file has initial data: ${file_name}`);
  const response = await fetch("http://localhost:3000/api/data/checkInit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ file_name }),
  });
  if (!response.ok) {
    console.error(`Failed to check init: ${response.statusText}`);
    return { success: false, error: response.statusText };
  }
  return await response.json();
}

// Repeatedly call the API until there's no function call, then do a streaming call
export async function POST(request: Request) {
  try {
    console.log("Received POST request");
    const { messages: userMessages } = await request.json();
    console.log("User messages:", userMessages);

    type Message =
      | { role: "system" | "user"; content: string }
      | { role: "function"; name: string; content: string };

    let conversation: Message[] = [
      { role: "system", content: "You are a helpful assistant." },
      ...userMessages,
    ];

    while (true) {
      console.log("Sending conversation to OpenAI:", conversation);
      const openAiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
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
              name: "write_initial_data",
              description: "Writes initial data to a .md BRS file",
              parameters: {
                type: "object",
                required: ["file_name", "data"],
                properties: {
                  data: { type: "string" },
                  file_name: { type: "string" },
                },
              },
            },
            {
              name: "update_markdown_file",
              description: "Updates a .md BRS file after check_init returns true",
              parameters: {
                type: "object",
                required: ["file_name", "data"],
                properties: {
                  data: { type: "string" },
                  file_name: { type: "string" },
                },
              },
            },
            {
              name: "check_init",
              description: "Checks if a BRS file has initial data",
              parameters: {
                type: "object",
                required: ["file_name"],
                properties: {
                  file_name: { type: "string" },
                },
              },
            },
          ],
          function_call: "auto",
          temperature: 0,
          stream: false,
        }),
      });

      if (!openAiResponse.ok) {
        const errorText = await openAiResponse.text();
        console.error(`OpenAI error: ${errorText}`);
        throw new Error(`OpenAI error: ${errorText}`);
      }

      const openAiResult = await openAiResponse.json();
      const message = openAiResult.choices[0].message;
      console.log("Received message from OpenAI:", message);
      conversation.push(message);

      // If we got a function call, execute it and push the result back
      if (message.function_call) {
        const { name, arguments: args } = message.function_call;
        const functionArgs = JSON.parse(args);
        console.log(`Executing function call: ${name} with args:`, functionArgs);
        let functionResult;

        if (name === "create_brs_file") {
          functionResult = await createFile(functionArgs.file_name);
        } else if (name === "write_initial_data") {
          functionResult = await write_initial_data(
            functionArgs.file_name,
            functionArgs.data
          );
        } else if (name === "update_markdown_file") {
          functionResult = await update_markdown_file(
            functionArgs.file_name,
            functionArgs.data
          );
        } else if (name === "check_init") {
          functionResult = await check_init(functionArgs.file_name);
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
        // No function call -> final text. Stream it back to client
        console.log("No function call, streaming final text to client");
        const streamingResponse = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4",
            messages: conversation,
            stream: true,
            temperature: 0,
          }),
        });

        if (!streamingResponse.body) {
          console.error("No streaming body found.");
          throw new Error("No streaming body found.");
        }

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
