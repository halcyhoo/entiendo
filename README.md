# Entiendo
#### Understanding Spanish

Entiendo is program to help you with real time, auditory processing of Spanish. A phrase will be spoken in Spanish while you listen and speak back the correct translation in English. Once you start getting the hang of it, you can level up to harder phrases.

Note: Earbuds with a mic is suggested instead of using your computers default microphone.

## Installing locally

Node and NPM are required.

1. Clone this repo
2. Open the terminal and run 'npm install' in the client and server directories
3. While in the server directory, import the questions and level data with this command: 'mongoimport --db entiendo --collection questions --file questions-data.json --jsonArray && mongoimport --db entiendo --collection levels --file levels-data.json --jsonArray'
4. In the server directory run this command: 'npm run-script build && npm start'
5. In a new terminal window, navigate to the client directory and run this command: 'PORT=3001 react-scripts start'

And you should be all set!
