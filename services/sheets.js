const { google } = require('googleapis');
const path = require('path');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const CREDENTIALS_PATH = path.join(__dirname, '../credentials.json');
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

async function getAuthClient() {
    const auth = new google.auth.GoogleAuth({
        keyFile: CREDENTIALS_PATH,
        scopes: SCOPES,
    });
    return await auth.getClient();
}

async function appendToSheet(data) {
    const client = await getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    const resource = {
        values: [
            [
                data.firstName,
                data.lastName,
                data.email,
                data.age,
                data.address,
                data.country,
                new Date().toISOString() // Timestamp
            ]
        ],
    };

    try {
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Sheet1!A:G',
            valueInputOption: 'USER_ENTERED',
            resource,
        });
        console.log('Data appended to sheet');
    } catch (error) {
        console.error('Error appending to sheet:', error);
        throw error;
    }
}

module.exports = { appendToSheet };
