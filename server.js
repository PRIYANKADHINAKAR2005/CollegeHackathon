
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
const projectSchema = new mongoose.Schema({
    TeamName: { type: String, required: true },
    ProblemStatementId: { type: String, required: true },
    Title: { type: String, required: true },
    Abstract: { type: String, required: true },
    TechStack: { type: String, required: true },
    PPT: { type: String, required: true },
    SolutionVideo: { type: String, required: true },
    GithubLink: { type: String, required: true }
});

// Create the model based on the schema
const Project = mongoose.model('Project', projectSchema);
app.get('/get_results', async (req, res) => {
    try {
        const teams = await Project.find();
        const problemStatementIds = [
            '25B3PS001', '25B3PS002', '25B3PS003', '25B3PS004', '25B3PS005',
            '25B3PS006', '25B3PS007', '25B3PS008', '25B3PS009', '25B3PS010'
        ];
        const results = {};
        for (const problemId of problemStatementIds) {
            const filteredTeams = teams.filter(team => team.ProblemStatementId === problemId);
            if (filteredTeams.length > 0) {
                results[problemId] = filteredTeams.map(team => team.TeamName);
            }
        }
        res.json({
            success: true,
            message: 'Results fetched successfully',
            data: results
        });
    } catch (error) {
        console.error('Error fetching results:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching results'
        });
    }
}); // <--- The block is now properly closed

// API to handle project submissions
app.post('/submit-project', async (req, res) => {
    try {
        const { TeamName, ProblemStatementId, Title, Abstract, TechStack, PPT, SolutionVideo, GithubLink } = req.body;

        // Create a new project instance
        const newProject = new Project({
            TeamName,
            ProblemStatementId,
            Title,
            Abstract,
            TechStack,
            PPT,
            SolutionVideo,
            GithubLink
        });

        // Save the project data to MongoDB
        await newProject.save();

        res.status(201).json({ message: 'Project submission successful!' });
    } catch (err) {
        console.error('Error:', err);
        res.status(400).json({ error: 'Failed to submit project. Ensure all fields are filled correctly.' });
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
