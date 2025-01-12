import { openAI } from "./secrets.js";


export const summarizeTasks = async (prompt) => {

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openAI()}`,
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are my cool and friendly personal assistant. heres my todays tasks fetched from todo app. please summarize my todays tasks in a nice motivating paragraph.' },
                { role: 'user', content: prompt },
            ],
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.log(response)
        throw new Error(`Error: ${response.statusText}, ${errorText}`);
    }

    const data = await response.json();
    console.log(data.choices[0].message.content);
    
    return data.choices[0].message.content;
};


// const test = async ()=>{
//     const result = await summarizeTasks("helloo yoyo say something cool");
//     generateSpeech(result);
// }

// test();
