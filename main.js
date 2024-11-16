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

const ISE = { message: 'Internal Server Error' }

app.use(cors(corsOptions));

const connection = mysql.createConnection({
  host: 'localhost',   // Database host
  user: 'root',        // Database user
  password: 'root',    // User password
  database: 'spending' // Database name
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

/////////////////

app.post('/addTransaction', (req, res) => {
  const { time, amount } = req.body;

  if (time == "" || amount == 0) {
    res.status(400).json({ error: 'Bad request' })
  }
  addTransaction(time, amount)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch(() => {
      res.status(500).json({ error: 'Failed to add transaction' });
    });
});

app.delete('/deleteTransaction/:id', (req, res) => {
  const id = req.params.id;

  deleteTransaction(id)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(() => {
      res.status(500).json(ISE);
    });
});

app.get('/getTransactions', async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;

  getTransactions(limit, offset)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(() => {
      res.status(500).json(ISE);
    })
});

/////////////////

function addTransaction(time, amount) {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO transaction (time, amount) VALUES (?, ?)';
    connection.query(query, [time, amount], (err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve({ message: 'Transaction added successfully' });
      }
    });
  });
}

function deleteTransaction(id) {
  return new Promise((resolve, reject) => {
    connection.query(`DELETE FROM transaction WHERE id = ?`, [id], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve({ message: 'Transaction deleted successfully' });
      }
    });
  });
}

function getTransactions(limit, offset) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM transaction LIMIT ? OFFSET ?';
    connection.query(query, [limit, offset], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

/////////////////

app.listen(port, () => {
  console.log(`Server running at port: ${port}`);
});