import express from 'express';
import { exec } from 'child_process';
import { fetchTasks } from './services/fetchTasks.js';
import { summarizeTasks } from './services/summarizetasks.js';
import { generateSpeech } from './services/tts.js';
import { tasksToString } from './utilities/tasksToString.js';

const app = express();
const port = 3000;

app.use(express.static('static'));
app.use(express.json());


// app.get('/', (req, res) => {
//     res.send('Hello from Raspberry Piiii!');
// });


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

let tasks = null;


//pass tasks
app.get("/get-tasks", async (req, res) => {
    if (!tasks){
        tasks = await fetchTasks();        
    }
    res.json(tasks);
});

app.get('/sumup', async (req, res) => {
    try {
        const summary = await summarizeTasks(tasksToString(tasks));
        await generateSpeech(summary);
        return res.status(200).send("success");
    } catch (e) {
        console.log(e)
        return res.status(500).send("chujnia: ", e);
    }
})

//list cron jobs
app.get('/api/cron', (req, res) => {
    exec('crontab -l', (err, stdout, stderr) => {
        if (err) {
            return res.status(500).send('Error reading cron jobs');
        }
        res.json({ jobs: stdout.split('\n').filter(line => line.trim()) });
    });
});