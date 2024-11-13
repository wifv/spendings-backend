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

const ISE = { message: 'Internal Server Error' }

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

app.post('/addTransaction', (req, res) => {
  const { time, amount } = req.body;
  addTransaction(time, amount)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({ error: 'Failed to add transaction' });
    });
});

app.get('/getTransactions', async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;

  try {
    const results = await getTransactions(limit, offset);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json(ISE);
  }
});

app.delete('/deleteTransaction/:id', (req, res) => {
  const id = req.params.id;

  deleteTransaction(id)
    .then(() => {
      res.status(200).json({ message: 'Transaction deleted successfully' });
    })
    .catch((err) => {
      res.status(500).json(ISE);
    });
});


function addTransaction(time, amount) {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO transaction (time, amount) VALUES (?, ?)`;
    connection.query(query, [time, amount], (err, results) => {
      if (err) {
        reject(err); // Reject the promise if there's an error
      } else {
        resolve({ message: 'Transaction added successfully', transactionId: results.insertId }); // Resolve the promise with a success message
      }
    });
  });
}

function deleteTransaction(id) {
  connection.query(`delete from transaction where id = ${id}`, (err, response) => {
    if (err) {
      return
    }
    return
  })
}

function getTransactions(limit, offset) {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM transaction LIMIT ${limit} OFFSET ${offset}`, (err, results) => {
      if (err) {
        reject(err); // Reject the promise if there's an error
      } else {
        resolve(results); // Resolve the promise with the query results
      }
    });
  });
}
/////////////////

app.listen(port, () => {
  console.log(`Server running at port: ${port}`);
});