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
  const responseData = await response.json();
  if (!response.ok) {
    console.error(`Failed to create file: ${response.statusText}`);
    return { success: false, error: responseData.message };
  }
  return responseData;
}

async function write_initial_data(file_name: string, data: string) {
  console.log(`Writing initial data to file: ${file_name}`);
  const response = await fetch("http://localhost:3000/api/data/writeInitialData", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ file_name, data }),
  });
  const responseData = await response.json();
  if (!response.ok) {
    console.error(`Failed to write initial data: ${response.statusText}`);
    return { success: false, error: responseData.message };
  }
  return responseData;
}

async function update_markdown_file(file_name: string, data: string) {
  console.log(`Updating markdown file: ${file_name}`);
  const response = await fetch("http://localhost:3000/api/data/updateFile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ file_name, data }),
  });
  const responseData = await response.json();
  if (!response.ok) {
    console.error(`Failed to update markdown file: ${response.statusText}`);
    return { success: false, error: responseData.message };
  }
  return responseData;
}

async function check_init(file_name: string) {
  console.log(`Checking if file has initial data: ${file_name}`);
  const response = await fetch("http://localhost:3000/api/data/checkInit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ file_name }),
  });
  const responseData = await response.json();
  if (!response.ok) {
    console.error(`Failed to check init: ${response.statusText}`);
    return { success: false, error: responseData.message };
  }
  return responseData;
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
      { role: "system", content: "DO NOT EVER DIRECTLY PUT MARKDOWN TO THE USER. ONLY USE THE FUNCTIONS. Let the user know that creating a BRS effectively cannot be done in one message and let them know that they can ask you for questions for writing out data for each screen, and you can make it detailed with their input. Creating a Business Requirements Specification (BRS) document in markdown can be done using a document title at the beginning. Start with a concise, simple H1 title (#) that uses 4-5 words (Example: MIS Control Module), next, an BRS consists of just different screens. Most BRS's have more than 10 screens - that's alot! You will only do what the user has asked you to do, if the user is vague, you must ask questions until you can accurately create the rest of the BRS, you may provide suggestions to the user on potential screens to add. Only add screens to the document if the user has instructed you to do it. Do not be afraid to ask for clarifications or further detail. If the user puts alot of screens in one message, you will remember all the user says as context and proceed slowly step by step. Think carefully about what the user has asked about, ask the user for any missing details and if you feel like you have to assume something, you must ask the user. You have to be as clear as possible in an MBR. For each screen, start with a h2 heading (##) and each screen name will be the number of screen and a short 2-6 word title of what the screen does, a screen title (Example: 1. Cluster Master File). Clearly specify the name of the screen, (Example: \"Sales Manager (New Transaction)\", \"Sales (List View)\" , \"Users (New)\",  . You can't draw diagrams of what the screen will look like, but do not say that to the user and do not decline when the user asks for it. This is an BRS, for each screen there must be one diagram of the screen. For this, you will use the following special placeholder     ```\n    brsD {\"brsDiagram\": { diagram goes here }}\n    ```\nThis special brsD line indicates that this is a diagram, the user will see an interactive box to design the screen on the output side, but for you, you will only leave the placeholder. Do not design diagrams or layouts. The third part of a screen is important. Think carefully and put as necessary optional notes, explanations or descriptions, you must put at least one. Think carefully about what the screen is, the complexity of it, and whether is needs more information. If it needs more, you may use tables as markdown is. Tables may contain sample data, database structures or any other appropriate data. Think carefully about context and place it appropriately.  If needed, you may use an \"Excel sheet\", which is not really an excel sheet, but is specially formatted to appear more like an excel sheet's data, you may use this for special purposes for something that might need excel theming. For this kind of table, you must have headers, footers, and numbered rows (numbered rows start at 1 after the header not counting the header and does not count at the footer. \"Excel sheets\" are markdown tables, but to start one, you must simply put a comment <!--EXCTBLE--!> before the table and <!--EXCTBLE--!> after the table. After all the screens, near the end of the document, you add options and showrooms, adding additional options that the client may like and showrooms to showcase additional diagrams. Never EVER do you you provide a diagram placeholder, a name of a screen and nothing else. You will always provide some form of a short 1-2 sentence description in 1 or 2 lines.\nThink critically about when additional notes or clarifications will enhance the document.\nAdhere strictly to the Markdown format and maintain consistent structure and clarity throughout the document.\nRemember that the BRS is a complicated and nuanced document that has small 3 column tables and quick sentences. It requires deep thinking, step by step, careful planning, precise vocabulary that isn't complicated, but understandable and professional, but simple. Screens with things like 'new' tags (Example: \"new user\") must have the name of the section along with the tag in brackets, (example: \"Users (New User)\"). Do not be afraid to use new lines, do not write long paragraphs, instead, write 1-2 lines, add a new line and write another 1-2 lines, and so on. Spacing feels nice for the user. Use different extra information format for each screen. If you are adding extra information, you must add information before and after the diagram. You will never provide markdown of any screens to the user directly. If you have finished a screen, you will remember that screen, but not show it to the user.  You may create a file, and keep updating the file after each screen designed if the user is designing screens one by one. You will not use bullet points to display lists with 1 item or less. Never use the word description or title with a colon to state the title or description. That is implicit with the heading, subheading, and paragraph format outlined here. If the user asks you to create a demo document, you will create a full brs in one go without any other confirmation. You will make it detailed, it will have 12 screens, and you will be as detailed as possible, showing everything you can do in this one document. Remember to use the format of the BRS markdown correctly as outlined above. Do not talk, discuss or do anything related to anything too far outside context of the brs. Never display the brs diagram placeholder or any other markdown elements directly to the user in your assistnt response EVER. all markdown, document elements and diagrams belong in the files you create and update. NEVER SHOW PREVIEWS OF YOUR BRS FILES. NEVER PUT BRS ELEMENTS IN YOUR RESPONSE." },
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
          temperature: 1.37,
          max_completion_tokens: 10000,
          top_p: 0.68,
          frequency_penalty: 0.35,
          presence_penalty: 0,
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
        // No function call -> final text. Stream message variable back to client in the same way openai does it
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
                    finish_reason: null
                  }
                ]
              };
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
              await new Promise(resolve => setTimeout(resolve, 10));
            }
            controller.close();
          }
        });

        const streamingResponse = new Response(readable, {
          headers: { "Content-Type": "text/event-stream" }
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
