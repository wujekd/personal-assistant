import express from 'express';
import { exec } from 'child_process';
import { fetchTasks } from './services/fetchTasks.js';
import { summarizeTasks } from './services/summarizetasks.js';
import { generateSpeech } from './services/tts.js';
import { tasksToString } from './utilities/tasksToString.js';
import cors from "cors";
import { WebSocketServer } from 'ws';

const app = express();
const port = 3000;
const wss = new WebSocketServer({port: 3001})

let state = { temperature: -127, key: 0 }

app.use(express.static('static'));
app.use(express.json());
app.use(cors());

wss.on('connection', (ws)=> {
    console.log("Client connected");
    ws.send(JSON.stringify(state));

    ws.on("close", ()=> console.log('websocket closed'));
});



let lastKeyState = null

app.get("/update", (req, res) => {
    const sensorState = req.query.state;
    const temp = req.query.temp;
    const count = req.query.count;

    if (lastKeyState != sensorState){
        console.log("keystate updated: ", lastKeyState) 
        lastKeyState = sensorState
        if (sensorState == 1){
            exec(`python3 17on.py`)
        } else if (sensorState == 0){
            exec(`python3 12off.py`)
        }
    }

    console.log(`KEY: ${sensorState} | TEMPERATURE: ${temp} | COUNT: ${count}`);
    res.send("OK");
});



//gui testing 
app.get('/update-state', (req, res) => {
    const { temperature, key } = req.query;

    if (temperature === undefined || key === undefined) {
        return res.status(400).json({ error: 'Temperature and key state are required' });
    }

    wsTest(temperature, key);
    res.json({ message: 'State updated via WebSocket', temperature, key });
});





//gui dev
app.get("/temperature", (req, res) => {
    const temp = Math.round(Math.random() * 60)
    console.log("passing temp as: ", temp)
    res.status(200).json({temperature : temp})
})


app.listen(port, "0.0.0.0", () => {
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