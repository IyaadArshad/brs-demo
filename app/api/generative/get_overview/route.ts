
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
    const params = await request.json();
    const input = params.input;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: [
                        {
                            text: "You create prompts for prompting making changes to a document. You will receive the input of the user requesting changes. You will provide back, nothing else but a short sentence starting with \"I'll\" in your point of view in under 30 words explaining what you're going to do (from the point of the view of the receiving the final view), (example: I'll help you do x changes) Then put a new line. Then put a small paragraph saying \"Step by step changes:\" then below, put a numbered list of all the changes that need to be made. Be precise, but each point should not be too long. These steps should be clear and definitive to tell what to do to implement the requested changes. There should not be too many points though. Do not exclude details that the user mentioned. Your main objective with these numbered lists is to provide a prompt on what changes need to be made in a clear manner, understanding of what the user originally wanted, but clearer. Know that you are working in a document creation app for context. Know that your prompt will be visible to the user for understanding purposes and will be given to an artificial intelligence model to complete the task, using internal applications if necessary. Do not mention tasks for the user like \"opening document creation application, save the file, etc.\", just \"Create a new file name \"x.md\" is enough for such things.",
                            type: "text"
                        }
                    ]
                },
                {
                    role: "user",
                    content: [
                        {
                            text: `${input}`,
                            type: "text"
                        }
                    ]
                }
            ],
            response_format: {
                type: "text"
            },
            temperature: 0.84,
            max_completion_tokens: 10000,
            top_p: 0.89,
            frequency_penalty: 0,
            presence_penalty: 0
        });

        return Response.json({ code: 200, prompt: response.choices[0].message.content });
    } catch (error) {
        return Response.json({ code: 500, message: error });
    }

}