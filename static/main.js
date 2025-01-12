

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

    const targetTime = new Date(Date.now() + 1 * 10 * 1000); // Replace with your desired time
    setTimer(targetTime);
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

function setTimer(targetTime) {
    const countdownElement = document.getElementById("time-remaining");

    function updateClock() {
        const now = new Date();
        const timeDifference = targetTime - now;

        if (timeDifference <= 0){
            clearInterval(timer);
            countdownElement.textContent = "00:00:00";
            console.log("times up!!!!")
            triggerAction();
            return;
        }
        const hours = String(Math.floor(timeDifference / (1000 * 60 * 60))).padStart(2, "0");
        const minutes = String(Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, "0");
        const seconds = String(Math.floor((timeDifference % (1000 * 60)) / 1000)).padStart(2, "0");

        countdownElement.textContent = `${hours}:${minutes}:${seconds}`;
    }
    const timer = setInterval(updateClock, 1000);
    updateClock();
}

async function triggerAction(){
    sumupAndPlay();
}