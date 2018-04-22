/**
 * Authenticate Google Sheets API
 * @type {"fs"}
 */
let fs = require('fs');
let readline = require('readline');
let googleAuth = require('google-auth-library');

let SCOPES = ['https://www.googleapis.com/auth/spreadsheets']; //you can add more scopes according to your permission need. But in case you chang the scope, make sure you deleted the ~/.credentials/sheets.googleapis.com-nodejs-quickstart.json file
const TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + '/.credentials/'; //the directory where we're going to save the token
const TOKEN_PATH = TOKEN_DIR + 'sheets.googleapis.com-nodejs-quickstart.json'; //the file which will contain the token

class Authentication {
    authenticate(){
        return new Promise((resolve, reject)=>{
            let credentials = this.getClientSecret();
            let authorizePromise = this.authorize(credentials);
            authorizePromise.then(resolve, reject);
        });
    }
    getClientSecret(){
        if(process.env.HEROKU) {
            return JSON.parse(process.env.GOOGLE_SHEETS_API);
        } else {
            return require('./credentials.json');
        }
    }
    authorize(credentials) {
        var clientSecret = credentials.installed.client_secret;
        var clientId = credentials.installed.client_id;
        var redirectUrl = credentials.installed.redirect_uris[0];
        var auth = new googleAuth();
        var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

        return new Promise((resolve, reject)=>{
            // Check if we have previously stored a token.
            if(process.env.HEROKU) {
                let token = process.env.TOKEN;

                if(!token) {
                    console.log('Missing token from Heroku!');
                    this.getNewToken(oauth2Client).then((oauth2ClientNew)=>{
                        resolve(oauth2ClientNew);
                    }, (err)=>{
                        reject(err);
                    });
                } else {
                    console.log('Token present.');
                    oauth2Client.credentials = JSON.parse(token);
                    resolve(oauth2Client);
                }

            } else {
                fs.readFile(TOKEN_PATH, (err, token) => {
                    console.log(TOKEN_PATH);
                    if (err) {
                        this.getNewToken(oauth2Client).then((oauth2ClientNew)=>{
                            resolve(oauth2ClientNew);
                        }, (err)=>{
                            reject(err);
                        });
                    } else {
                        oauth2Client.credentials = JSON.parse(token);
                        resolve(oauth2Client);
                    }
                });
            }
        });
    }
    getNewToken(oauth2Client, callback) {
        return new Promise((resolve, reject)=>{
            var authUrl = oauth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: SCOPES
            });
            console.log('Authorize this app by visiting this url: \n ', authUrl);
            var rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            rl.question('\n\nEnter the code from that page here: ', (code) => {
                rl.close();
                oauth2Client.getToken(code, (err, token) => {
                    if (err) {
                        console.log('Error while trying to retrieve access token', err);
                        reject();
                    }
                    oauth2Client.credentials = token;
                    this.storeToken(token);
                    resolve(oauth2Client);
                });
            });
        });
    }
    storeToken(token) {
        try {
            fs.mkdirSync(TOKEN_DIR);
        } catch (err) {
            if (err.code != 'EEXIST') {
                throw err;
            }
        }
        fs.writeFile(TOKEN_PATH, JSON.stringify(token));
        console.log('Token stored to ' + TOKEN_PATH);
    }
}

module.exports = new Authentication();
