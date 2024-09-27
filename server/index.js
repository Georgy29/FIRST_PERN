const pool = require('./dbconfig');
require("dotenv").config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("Hello World!");
  });

app.listen(PORT, () => {
    console.log(`Server listening on the port  ${PORT}`);

app.get('/badges', async (req, res) => {
    try {

        //query the database to get all records from the table
        const list_badges = await pool.query('SELECT * FROM badges_list');

        // Send the rows (array of data) as a response and in JSON format.
        res.json(list_badges.rows);

    } catch (err) {
        res.status(500).send('Internal error:'+ err); 
    }
});

app.delete('/badges/:id', async (req, res) => {
    try {

      // Extract id parameter from the request object
      const { id } = req.params; 
      const badge = await pool.query(
        `delete from badges_list where id =$1`, [id]);
      res.json(badge.rows[0]);
    }catch (err) {
      res.status(500).send('Internal error:'+ err); 
    }
  });

app.put('/badges/:id', async (req, res) => {
try {

    // Extract id parameter from the request object
    const { id } = req.params; 

    // Extract the new title, and description submitted from the form.
    const { title, description} = req.body; 
    const badge = await pool.query(
    `update badges_list set title=$2, description=$3 where id =$1`, [id, title, description]);
    res.json(badge.rows[0]);
}catch (err) {
res.status(500).send('Internal error:'+ err); 
}
});

app.post('/badges', async (req, res) => {
    try {
      const { title, description } = req.body;  

      const newBadge = await pool.query(
        `INSERT INTO badges_list (title, description) VALUES($1, $2) RETURNING *`,
        [title, description]
      );
      res.json(newBadge.rows[0]);

    } catch (err) {
    res.status(500).send('Internal error:'+ err); 
    }
  });

});