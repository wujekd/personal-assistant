import { openAI } from "./secrets.js";

const summarizeTasks = async (tasks) => {
    const prompt = `test test 123 say hi.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openAI()}`,
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: prompt },
            ],
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error: ${response.statusText}, ${errorText}`);
    }

    const data = await response.json();
    
    return data.choices[0].message.content;
};


const test = async ()=>{
    const result = await summarizeTasks();
    console.log(result);
    
}


test();