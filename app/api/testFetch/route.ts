import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const mockFunctions = {
  createFile: async (file_name: string) => {
    const response = await fetch("/api/data/createFile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ file_name }),
    });

    if (!response.ok) {
      return {
        success: false,
        error: response.statusText
      };
    }

    const data = await response.json();

    if (data.success) {
        return {
            success: true,
            file_name: data.file_name,
            message: data.message
        }
    } else {
        return {
            success: false,
            file_name: data.file_name,
            message: data.message
        }
    }
  },
  write_initial_data: () => ({ success: true }),
  update_markdown_file: () => ({ success: true }),
  check_init: () => ({ success: true }),
};

export async function POST(request: Request) {
  const { messages } = await request.json();

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    stream: true,
    tools: [
      {
        type: "function",
        function: {
          name: "create_brs_file",
          description:
            "Creates a file for the Business Requirements Specification (BRS) document using a specified name ending with .md",
          parameters: {
            type: "object",
            required: ["file_name"],
            properties: {
              file_name: {
                type: "string",
                description:
                  "The name of the BRS file, which must contain only lowercase a-z characters, and uppercase a-z characters, and may include dashes, with no spaces and must end with .md",
              },
            },
            additionalProperties: false,
          },
          strict: true,
        },
      },
      {
        type: "function",
        function: {
          name: "write_initial_data",
          strict: true,
          parameters: {
            type: "object",
            required: ["file_name", "data"],
            properties: {
              data: {
                type: "string",
                description: "The markdown data to be written to the file",
              },
              file_name: {
                type: "string",
                description: "The name of the markdown file to write to",
              },
            },
            additionalProperties: false,
          },
          description:
            "Writes initial data to a markdown file, ending in .md, a brs document, after create_brs_file has been run.",
        },
      },
      {
        type: "function",
        function: {
          name: "update_markdown_file",
          strict: true,
          parameters: {
            type: "object",
            required: ["file_name", "data"],
            properties: {
              data: {
                type: "string",
                description:
                  "Markdown data to be added, completely overwriting the existing markdown file. Do not replace existing unchanged text with a note saying unchanged at all. You must rewrite everything in full as is, changing only what the user has asked, without being lazy",
              },
              file_name: {
                type: "string",
                description: "The name of the markdown file to write to",
              },
            },
            additionalProperties: false,
          },
          description:
            "Updates a markdown file, a brs document. Requires create_brs_file to have been run and check_init to return true.",
        },
      },
      {
        type: "function",
        function: {
          name: "check_init",
          strict: true,
          parameters: {
            type: "object",
            required: ["file_name"],
            properties: {
              file_name: {
                type: "string",
                description:
                  "The name of the brs file to check for initial data.",
              },
            },
            additionalProperties: false,
          },
          description:
            "Checks if the brs file has initial data written. If true, it can be updated; if false, write_initial_data must be run first before updating the file.",
        },
      },
    ],
    temperature: 1.31,
    max_tokens: 10000,
    top_p: 0.7,
    frequency_penalty: 0.15,
    presence_penalty: 0,
  });

  // Transform the response into a ReadableStream
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      for await (const chunk of response) {
        // Handle function calls
        if (chunk.choices[0]?.delta?.tool_calls) {
          const toolCall = chunk.choices[0].delta.tool_calls[0];
          if (toolCall.function) {
            const functionName = toolCall.function.name;
            if (!toolCall.function.arguments) throw new Error("Missing function arguments");
            const functionArgs = JSON.parse(toolCall.function.arguments);
            
            const result = await mockFunctions[
              functionName as keyof typeof mockFunctions
            ](functionArgs.file_name);

            controller.enqueue(encoder.encode(
              `data: ${JSON.stringify({
                type: "function",
                function: functionName,
                arguments: functionArgs,
                result,
              })}\n\n`
            ));
          }
        }
        
        // Handle regular content
        if (chunk.choices[0]?.delta?.content) {
          controller.enqueue(encoder.encode(
            `data: ${JSON.stringify({
              type: "content",
              content: chunk.choices[0].delta.content,
            })}\n\n`
          ));
        }
      }

      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
