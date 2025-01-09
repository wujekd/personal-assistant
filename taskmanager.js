import { todoistKey } from './secrets.js';


const fetchTasks = async () => {
    const response = await fetch('https://api.todoist.com/rest/v2/tasks', {
        headers: {
            Authorization: `Bearer ${todoistKey()}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }

    const tasks = await response.json();
    console.log(tasks);
};

fetchTasks();