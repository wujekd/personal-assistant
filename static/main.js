


// import { generateSpeech } from "./tts.js";
document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('/get-tasks');
    console.log(response)
    const tasks = await response.json();

    console.log(tasks);

    const taskList = document.getElementById('task-list');
    tasks.forEach(task => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <strong>${task.content}</strong>
            <p>Due: ${task.due.date}</p>
            <p>Completed: ${task.is_completed ? 'Yes' : 'No'}</p>
        `;
        taskList.appendChild(listItem);
    });
});

const player = document.querySelector("audio"); 
document.querySelector("button").addEventListener("click", ()=> {
    sumupAndPlay();  
})


async function sumupAndPlay() {
    const response = await fetch("/sumup")
    player.src = "speech.mp3";
    player.play();
}