const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql2');
const input = require('input'); // npm install input

app.use(cors());
app.use(express.json());

app.use(cors({ origin: 'https://reminder-lemon.vercel.app/' }));

app.post('/addToMoney', (req, res) => {
  if (req.body) {
    addToMoney(req.body.time, req.body.amount)
    res.statusCode = 200
    res.json({ message: 'Good stuff' });
  }
})


// Create a connection object
const connection = mysql.createConnection({
  host: 'localhost',   // Database host
  user: 'root',        // Database user
  password: 'root',    // User password
  database: 'spending' // Database name
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

function addToMoney (time, amount) {
  connection.query(`insert into money values(${time}, ${amount})`, (err, response) => {
    if (err) {
      console.log('Error: ' + err)
      return 0
    }
    console.log('response: ' + response)
    return 1
  })
}

input.text('to end the connection type /end ')
.then(text => {
  if (text == '/end') {
    connection.end((err) => {
      if (err) {
        console.error('Error closing the connection:', err);
        return;
      }
      console.log('Connection closed');
    });
  }
})