const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql2');
const input = require('input'); // npm install input
const port = 3000

app.use(cors());
app.use(express.json());

const corsOptions = {
  origin: ['http://localhost:5173'],
  methods: 'GET,POST',
};

app.use(cors(corsOptions));



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
  connected = true
});

app.post('/addTransaction', (req, res) => {
  if (req.body) {
    console.log(req.body)
    addTransaction(req.body.time, req.body.amount)
    res.statusCode = 200
    res.json({ message: 'Good stuff' });
  }
})

app.get('/getTransactions', (req, res) => {
  const limit = parseInt(req.query.limit)
  const offset = parseInt(req.query.offset)
  console.log(limit, offset)
  let results = getTransactions(10, 0)
  if (results == 500) {
    res.status(500).send('Internal Server Error')
  }
  res.status = 200
  res.json(results)
})

app.delete('/deleteTransaction', (req, res) => {
  if (req.body) {
    console.log(req.body)
    addTransaction(req.body.time, req.body.amount)
    res.statusCode = 200
    res.json({ message: 'Good stuff' });
  }
})

function addTransaction(time, amount) {
  console.log('time: ' + time, 'amount: ' + amount)
  connection.query(`insert into transaction (time, amount) values("${time}", ${amount})`, (err, response) => {
    if (err) {
      console.log('Error: ' + err)
      return 500
    }
    console.log('response: ' + response)
    return
  })
}

function deleteTransaction(id) {
  console.log("id: " + id)
  connection.query(`delete from transaction where id = ${id}`, (err, response) => {
    if (err) {
      console.log('Error: ' + err)
      return
    }
    console.log('response: ' + response)
    return
  })
}

function getTransactions(limit, offset) {
  connection.query(`select * from transaction limit ${limit} offset ${offset}`, (err, response) => {
    if (err) {
      console.log('Error: ' + err)
      return
    }
    console.log('response: ' + response)
    return
  })
}



// connection.end((err) => {
//   if (err) {
//     console.error('Error closing the connection:', err);
//     return;
//   }
//   console.log('Connection closed');
// });

app.listen(port, () => {
  console.log(`Server running at port: ${port}`);
});