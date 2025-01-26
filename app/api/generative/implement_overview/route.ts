import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const params = await request.json();
  const overview = params.overview;
  const file_name = params.file_name;

  const file_contents_fetch = await fetch(
    `http://localhost:3000/api/generative/functions/read_file?file_name=${file_name}`
  );
  const file_contents = await file_contents_fetch.json();

  const prompt = {
    implementation_overview_prompt: `${overview}`,
    currentVersion: `${file_contents.data}`,
  };

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: [
            {
              text: 'You are given prompts that request changes be made to a BRS document. You will add, make changes, or remove sections that are requested by the user. Do not remove any part of the document unless the user has explicitly stated so. You will update the document and respond with the full updated version of the document. Do not be lazy, you will not exclude any part of the original document. Do not change any part of the document unless instructed to by the user. For your reference, here is what a BRS is like: "At the topmost section of the document, there is the main heading. A simple, concise H1 title (#) that is 4-5 words (Example: MIS Control Module). If this heading is already in the document, do not modify it unless specified by the user. Do not delete this heading, no matter what happens. A BRS is just a document that consists of different screens. Each screen has 4 sections. The first is the H2 (##) Heading that is the name of the screen. It is numbered, so the heading is prefixed with a 1. or 2. or 3. etc. It is a short 2-6 word of what the title does. If the screen is part of a larger screen (by context), the current smaller section is in brackets. Think carefully about using this. This would be like the users page, but the current screen is that of a new transaction, this would be "Users (New User)", other examples include "Sales (List View)", "Sales Manager (New Transaction)" etc. The second part of a screen is some extra information. It is usually a simple sentence explaining the screen. Use casual language for this one, but don\'t be unprofessional. Use simple language that gets the point across. This doesn\'t always need to be there. Most of the time, this second section isn\'t there anyway. Just keep in mind this exists. The third section is the diagram. This is mandatory for all screens, unless the user has explicitly said not to add a diagram. Don\'t add diagrams on existing screens that don\'t have a diagram. If you are creating a new screen, and you need a diagram, use this ```{"brsD": {}}```. This is an empty template document. You are not allowed to put anything else for diagrams. Just that small snippet. For the user, an interactive button will appear for customizing that diagram, but for you, you do not do anything with diagrams. You can add the empty template diagram for new screens, but cannot do anything to existing diagrams, nor can you change the data for the empty template. The fourth and last section of every screen is the extra dat. You will always provide some for of a short 1-2  sentence description in 1 or 2 lines.  Think carefully about what the screen is, the complexity of it, and whether is needs more information. Think carefully about context and place it appropriately. Think critically about when additional notes or clarifications will enhance the document. This could be adding a table for some same data, tables to specify form field types, bullet points for extra info, etc. Do not be afraid to use new lines, do not write long paragraphs, instead, for the parts of new screens (2 and 4), write 1-2 lines, add a new line and write another 1-2 lines, and so on. Spacing feels nice for the user. Use different extra information format for each screen. If you are adding extra information, you must add information before and after the diagram. You will not use bullet points to display lists with 1 item or less. Never use the word description or title with a colon to state the title or description. That is implicit with the heading, subheading, and paragraph format outlined here. Use the format of the BRS markdown correctly as outlined above. Strictly follow this."',
              type: "text",
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `${prompt}`
            },
          ],
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "version_response",
          schema: {
            type: "object",
            required: ["newVersion"],
            properties: {
              newVersion: {
                type: "string",
                description:
                  "Updated version of the document with changes the user requested implemented",
              },
            },
            additionalProperties: false,
          },
          strict: true,
        },
      },
      temperature: 0.7,
      max_completion_tokens: 10000,
      top_p: 0.9,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    // just publish a new version
    const messageContent = response.choices[0].message.content;
    if (messageContent === null) {
      throw new Error("Response message content is null");
    }

    const content = JSON.parse(messageContent);
    await fetch("http://localhost:3000/api/data/publishNewVersion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ file_name, data: content.newVersion }),
    });

    return Response.json({
      code: 200,
      message: "Successfully updated the document",
    });
  } catch (error) {
    return Response.json({ code: 500, message: error });
  }
}