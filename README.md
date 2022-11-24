# Web ChatApp

Realtime chat app built with websockets using Node.js, Express, and Socket.io with vanilla JavaScript. Includes login and authentication using AWS REST API, DynamoDB, and Lambda. HTML, CSS, and JavaScript for the front-end.

## Usage

1. Both on the client and server directories: `npm install` <br/>
2. Create a DynamoDB database on AWS and a REST API to invoke Lambda
3. Copy the backend code to your Lambda to perform backend functionalities
4. Create an API key to securely access your REST API and store it in your _.env_ file
5. Edit the database name to match your database name
6. cd to server: `npm run dev` <br/>
7. _Go to localhost:3000_
8. Open localhost:3000 from multiple browsers to login as different users

> For logging in to any group temporarily use the password format **groupname123**.
