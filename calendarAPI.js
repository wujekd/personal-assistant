import fs from 'fs/promises';
import path from 'path';
import process from 'process';
import { authenticate } from '@google-cloud/local-auth';
import { google } from 'googleapis';

/**
 * If modifying these scopes, delete token.json.
 */
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

/**
 * The file token.json stores the user's access and refresh tokens, and is
 * created automatically when the authorization flow completes for the first
 * time.
 */
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'service-account.json');


/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listEvents(auth) {
  const calendar = google.calendar({version: 'v3', auth});


  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Ensure 2-digit format
  const day = String(today.getDate()).padStart(2, '0');

  // Set time range for the entire day (from 00:00:00 to 23:59:59)
  const timeMin = new Date(`${year}-${month}-${day}T00:00:00Z`).toISOString();
  const timeMax = new Date(`${year}-${month}-${day}T23:59:59Z`).toISOString();




  const res = await calendar.events.list({
    calendarId: 'primary', // Replace with your shared calendar ID
    timeMin,
    timeMax,
    singleEvents: true,
    orderBy: 'startTime',
  });


  const events = res.data.items;
  if (!events || events.length === 0) {
    console.log('No upcoming events found.');
    return;
  }


//   events.map((event, i) => {
//     const start = event.start.dateTime || event.start.date;
//     console.log(`${start} - ${event.summary}`);
//   });

  events.forEach((event) => {
    const start = event.start.dateTime || event.start.date;
    const summary = event.summary || 'No title';
    const description = event.description || 'No description';

    console.log(`${start} - ${summary}`);
    console.log(`  Description: ${description}`);
  });
}


authorize().then(listEvents).catch(console.error);