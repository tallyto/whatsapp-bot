const { Client } = require('whatsapp-web.js');
const fs = require('fs');
const qrcode = require('qrcode-terminal');
// Path where the session data will be stored
const SESSION_FILE_PATH = './session.json';

// Load the session data if it has been previously saved
let sessionData;
if(fs.existsSync(SESSION_FILE_PATH)) {
    sessionData = require(SESSION_FILE_PATH);
}
// Use the saved values
const client = new Client({
    session: sessionData
});

client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

// Save session values to the file upon successful auth
client.on('authenticated', (session) => {
    console.log('Client has been authenticated!');
    if(!sessionData){
        fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
            if (err) {
                console.error(err);
            }
        });
    }   
});

client.on('message', message => {
	if(message.body == '!ping'){
        client.sendMessage(message.from, 'pong');
    }
    if(message.body == '!joke') {
        client.sendMessage(message.from, 'Why did the chicken cross the road? To get to the other side.');
    }
    if(message.body == '!time') {
        client.sendMessage(message.from, new Date().toString());
    }
    if(message.body == '!help') {
        client.sendMessage(message.from, '!ping - pong\n!joke - joke\n!time - time\n!help - help\n!social - social');
    }
    if(message.body == '!social') {
        client.sendMessage(message.from, '📸 Instagram: https://www.instagram.com/otallyto/\n🐦 Twitter: https://twitter.com/TallyScript\n');
    }   
});


client.initialize();