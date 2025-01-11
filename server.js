// const express = require('express');
// const mysql = require('mysql2');
// const cors = require('cors');
// const app = express();
// app.use(express.json());
// app.use(cors());
// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '#Priyanka2005',
//     database: 'Hackathon',
// });


// // Connect to MySQL
// connection.connect((err) => {
//     if (err) throw err;
//     console.log('Connected to MySQL database.');

//     // Create table if not exists
//     const createTableQuery = `
//     CREATE TABLE IF NOT EXISTS TeamDetails_2(
//         TeamNumber INT AUTO_INCREMENT PRIMARY KEY,
//         TeamName VARCHAR(100) NOT NULL,
//         Year INT NOT NULL,
//         Section VARCHAR(10) NOT NULL,
//         Gender VARCHAR(10) NOT NULL,
//         TeamLeaderName VARCHAR(100) NOT NULL,
//         TeamLeaderRegNo VARCHAR(50) NOT NULL,
//         TeamLeaderEmail VARCHAR(100) NOT NULL,
//         ProblemStatementId VARCHAR(10) NOT NULL,
//         Member1Name VARCHAR(100) NOT NULL,
//         Member1RegNo VARCHAR(50) NOT NULL,
//         Member1Email VARCHAR(100) NOT NULL,
//         Member2Name VARCHAR(100) NOT NULL,
//         Member2RegNo VARCHAR(50) NOT NULL,
//         Member2Email VARCHAR(100) NOT NULL,
//         Member3Name VARCHAR(100) NOT NULL,
//         Member3RegNo VARCHAR(50) NOT NULL,
//         Member3Email VARCHAR(100) NOT NULL
//     );
//     `;
//     connection.query(createTableQuery, (err) => {
//         if (err) throw err;
//         console.log('Table created successfully.');
//     });
// });

// app.post("/register-team", async (req, res) => {
//     console.log("Received request body:", req.body);  // Log the received data

//     const data = req.body;

//     const query = "INSERT INTO TeamDetails_2 (TeamName, Year, Section, Gender, TeamLeaderName, TeamLeaderRegNo, TeamLeaderEmail, ProblemStatementId, Member1Name, Member1RegNo, Member1Email, Member2Name, Member2RegNo, Member2Email, Member3Name, Member3RegNo, Member3Email) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

//     const values = [
//         data.TeamName,
//         data.Year,
//         data.Section,
//         data.Gender,
//         data.TeamLeaderName,
//         data.TeamLeaderRegNo,
//         data.TeamLeaderEmail,
//         data.ProblemStatementId,
//         data.Member1Name,
//         data.Member1RegNo,
//         data.Member1Email,
//         data.Member2Name,
//         data.Member2RegNo,
//         data.Member2Email,
//         data.Member3Name,
//         data.Member3RegNo,
//         data.Member3Email
//     ];

//     connection.query(query, values, (err, result) => {
//         if (err) {
//             console.log(err);
//             return res.status(500).send("Error inserting data into database.");
//         }

//         const newTeam = {
//             teamNumber: result.insertId,  // Add the team number here
//             teamDetails: data
//         };

//         res.status(201).json(newTeam);  // Return as JSON
//     });
// });


// app.listen(3000, () => {
//     console.log('Server running on http://localhost:3000');
// });
require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); 
const app = express();
app.use(express.static(path.join(__dirname, 'public')));
// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB Atlas
mongoose.connect(process.env.CONNECTION_STRING)
    .then(() => {
        console.log('Connected to MongoDB Atlas.');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB Atlas:', err);
    });


// Define the schema for TeamDetails
const teamSchema = new mongoose.Schema({
    TeamName: { type: String, required: true },
    Year: { type: Number, required: true },
    Section: { type: String, required: true },
    Gender: { type: String, required: true },
    TeamLeaderName: { type: String, required: true },
    TeamLeaderRegNo: { type: String, required: true },
    TeamLeaderEmail: { type: String, required: true },
    ProblemStatementId: { type: String, required: true },
    Member1Name: { type: String, required: true },
    Member1RegNo: { type: String, required: true },
    Member1Email: { type: String, required: true },
    Member2Name: { type: String, required: true },
    Member2RegNo: { type: String, required: true },
    Member2Email: { type: String, required: true },
    Member3Name: { type: String, required: true },
    Member3RegNo: { type: String, required: true },
    Member3Email: { type: String, required: true },
});

// Create the model based on the schema
const Team = mongoose.model('TeamDetails', teamSchema);

// API to register a team
app.post('/register-team', async (req, res) => {
    try {
        const team = new Team(req.body); // Create a new team instance from the request body
        await team.save(); // Save the team data to MongoDB

        const newTeam = {
            teamNumber: team._id, // MongoDB assigns an _id as the team number
            teamDetails: req.body,
        };

        res.status(201).json(newTeam); // Return the new team data as JSON
    } catch (err) {
        console.error('Error:', err);
        res.status(400).json({ error: err.message }); // Return validation errors or other issues
    }
});

app.get("/teams", async (req, res) => {
    try {
      const teams = await Team.find({});
      res.json(teams);
    } catch (err) {
      res.status(500).send("Error fetching teams: " + err);
    }
  });

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Make sure the HTML file is in the 'public' folder
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
