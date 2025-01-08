'use client';
import { useEffect, useState } from 'react';

const WeatherPage = () => {
    const [weatherData, setWeatherData] = useState<string>('Loading weather data...');

    // Mock weather function (you can replace this with real weather API)
    const get_weather = async (location: string, date: string) => {
        // Call your weather API here
        const response = await fetch('http://localhost:3000/api/weather', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ location, date }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return await response.json();
    };

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer sk-`,
                    },
                    body: JSON.stringify({
                        model: 'gpt-3.5-turbo',
                        messages: [
                            { role: 'system', content: 'You are a helpful assistant.' },
                            { role: 'user', content: 'What is the weather in Paris tomorrow?' }
                        ],
                        functions: [
                            {
                                name: 'get_weather',
                                description: 'Fetches weather information for a given location and date',
                                parameters: {
                                    type: 'object',
                                    properties: {
                                        location: { type: 'string' },
                                        date: { type: 'string' }
                                    },
                                    required: ['location', 'date']
                                }
                            }
                        ],
                        function_call: { name: 'get_weather' },
                    }),
                });

                const openAiResult = await openAiResponse.json();
                const functionArgs = JSON.parse(openAiResult.choices[0].message.function_call.arguments);

                // Execute the function called by GPT
                const weatherResult = await get_weather(functionArgs.location, functionArgs.date);

                // Send the result back to OpenAI
                const finalResponse = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer sk-`,
                    },
                    body: JSON.stringify({
                        model: 'gpt-3.5-turbo',
                        messages: [
                            { role: 'system', content: 'You are a helpful assistant.' },
                            { role: 'user', content: 'What is the weather in Paris tomorrow?' },
                            { 
                                role: 'assistant',
                                content: null,
                                function_call: {
                                    name: 'get_weather',
                                    arguments: JSON.stringify(functionArgs)
                                }
                            },
                            {
                                role: 'function',
                                name: 'get_weather',
                                content: JSON.stringify(weatherResult)
                            }
                        ]
                    }),
                });

                const finalResult = await finalResponse.json();
                setWeatherData(finalResult.choices[0].message.content);
            } catch (error) {
                console.error('Error fetching weather:', error);
                setWeatherData('Error fetching weather data.');
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
