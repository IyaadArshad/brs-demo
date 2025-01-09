'use client';
import { useEffect, useState } from 'react';

const WeatherPage = () => {
    const [weatherData, setWeatherData] = useState<string>('Loading weather data...');

    async function createFile (file_name: string) {
        const response = await fetch("/api/data/createFile", {
          method: "POST",
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
      }
    async function write_initial_data (file_name: string, data: string) {
        const response = await fetch("/api/data/writeInitialData", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ file_name, data }),
        });
    
        if (!response.ok) {
          return {
            success: false,
            error: response.statusText
          };
        }
    
        const responseData = await response.json();
    
        if (responseData.success) {
          return {
            success: true,
            message: responseData.message
          };
        } else {
          return {
            success: false,
            message: responseData.message
          };
        }
      }
    async function update_markdown_file (file_name: string, data: string) {
        const response = await fetch("/api/data/updateFile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ file_name, data }),
        });
    
        if (!response.ok) {
          return {
            success: false,
            error: response.statusText
          };
        }
    
        const responseData = await response.json();
    
        if (responseData.success) {
          return {
            success: true,
            message: responseData.message
          };
        } else {
          return {
            success: false,
            message: responseData.message
          };
        }
      }
    async function check_init (file_name: string) {
        const response = await fetch("/api/data/checkInit", {
          method: "POST",
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
    
        const responseData = await response.json();
    
        if (responseData.success) {
          return {
            success: true,
            message: responseData.message
          };
        } else {
          return {
            success: false,
            message: responseData.message
          };
        }
      }

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                type Message = 
                    | { role: 'system' | 'user'; content: string }
                    | { role: 'function'; name: string; content: string };
                
                let messages: Message[] = [
                    { role: 'system', content: 'You are a helpful assistant.' },
                    { role: 'user', content: 'hello.md' }
                ];

                while (true) {
                    const openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer `,
                      },
                      body: JSON.stringify({
                        model: 'gpt-4o',
                        messages: messages,
                        functions: [
                          {
                            name: "create_brs_file",
                            description: "Creates a file for the Business Requirements Specification (BRS) document using a specified name ending with .md",
                            parameters: {
                              type: "object",
                              required: ["file_name"],
                              properties: {
                                file_name: {
                                  type: "string",
                                  description: "The name of the BRS file, which must contain only lowercase a-z characters, and uppercase a-z characters, and may include dashes, with no spaces and must end with .md"
                                }
                              },
                              additionalProperties: false
                            }
                          },
                          {
                            name: "write_initial_data",
                            description: "Writes initial data to a markdown file, ending in .md, a brs document, after create_brs_file has been run.",
                            parameters: {
                              type: "object",
                              required: ["file_name", "data"],
                              properties: {
                                data: {
                                  type: "string",
                                  description: "The markdown data to be written to the file"
                                },
                                file_name: {
                                  type: "string",
                                  description: "The name of the markdown file to write to"
                                }
                              },
                              additionalProperties: false
                            }
                          },
                          {
                            name: "update_markdown_file",
                            description: "Updates a markdown file, a brs document. Requires create_brs_file to have been run and check_init to return true.",
                            parameters: {
                              type: "object",
                              required: ["file_name", "data"],
                              properties: {
                                data: {
                                  type: "string",
                                  description: "Markdown data to be added, completely overwriting the existing markdown file. Do not replace existing unchanged text with a note saying unchanged at all. You must rewrite everything in full as is, changing only what the user has asked, without being lazy"
                                },
                                file_name: {
                                  type: "string",
                                  description: "The name of the markdown file to write to"
                                }
                              },
                              additionalProperties: false
                            }
                          },
                          {
                            name: "check_init",
                            description: "Checks if the brs file has initial data written. If true, it can be updated; if false, write_initial_data must be run first before updating the file.",
                            parameters: {
                              type: "object",
                              required: ["file_name"],
                              properties: {
                                file_name: {
                                  type: "string",
                                  description: "The name of the brs file to check for initial data."
                                }
                              },
                              additionalProperties: false
                            }
                          }
                        ],
                        function_call: 'auto',
                      }),
                    });

                    const openAiResult = await openAiResponse.json();
                    const message = openAiResult.choices[0].message;
                    messages.push(message);

                    if (message.function_call) {
                        const { name, arguments: args } = message.function_call;
                        const functionArgs = JSON.parse(args);

                        let functionResult;
                        
                        if (name === 'create_brs_file') {
                            functionResult = await createFile(functionArgs.file_name);
                        } else if (name === 'write_initial_data') {
                            functionResult = await write_initial_data(functionArgs.file_name, functionArgs.data);
                        } else if (name === 'update_markdown_file') {
                            functionResult = await update_markdown_file(functionArgs.file_name, functionArgs.data);
                        } else if (name === 'check_init') {
                            functionResult = await check_init(functionArgs.file_name);
                        } else {
                            throw new Error(`Function ${name} not found.`);
                        }

                        messages.push({
                            role: 'function',
                            name: name,
                            content: JSON.stringify(functionResult)
                        });
                    } else {
                        setWeatherData(message.content);
                        break;
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setWeatherData('Error fetching data.');
            }
        };

        fetchWeather();
    }, []);

    return (
        <div>
            <h1>OpenAI API Function Calling Example</h1>
            <p>{weatherData}</p>
        </div>
    );
};

export default WeatherPage;