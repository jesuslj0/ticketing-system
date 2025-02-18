import express from 'express';
import Ticket from '../models/Ticket.js';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';
import buildFilter from '../middleware/filter.js';
import paginate from '../middleware/pagination.js';

const router = express.Router();

// Get all tickets
// Public
// GET /api/tickets/

// Get ticket by ID
// GET api/tickets/id
router.get("/:id", async (req, res) => {
    try {
        const ticket = await Ticket.findOne({ id: req.params.id });
        if (!ticket) return res.status(404).json({ message: "Ticket not found."});

        res.status(200).json({ ticket: ticket})
    } catch (err) {
        res.status(500).json({ message: "Server Error: "+err.message});
    }
})

// Filter tickets
// GET api/tickets?page=1&pageSize=10
// GET /api/tickets?status=open&priority=high
// GET /api/tickets?search=bug

router.get("/", buildFilter, paginate(Ticket), async (req, res) => {
    res.status(200).json(req.paginatedResults);
})


// Create a ticket
// Private (only logged in users can create tickets)
// POST api/tickets/
// Ticket Schema; user, title, description, priority, status
router.post("/", auth, async (req, res) => {
    const newTicket = new Ticket({
        user: req.user._id,
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
        priority: req.body.priority,
    })

    try {
        const ticket = await newTicket.save()
        res.status(201).json({ ticket: ticket })
    } catch (error) {
        res.status(500).json({ message: "Server Error: "+error.message})
    }
})

// Update a ticket by ID
// Private (only logged in users can create tickets)
// PUT api/tickets/id
// Ticket Schema; user, title, description, priority, status
router.put("/:id", auth, async (req, res) => {
    const update = req.body;

    try {
        const ticket = await Ticket.findOneAndUpdate({ id: req.params.id }, update, { new: true });
        if (!ticket) { return res.status(404).json({ message: "Ticket not found."})};
        
        res.status(200).json({ ticket: ticket});

    } catch (error) {
        res.status(500).json({ message: "Server Error: "+err.message});
    }
})

// Delete a ticket by ID
// Private (only admin users can delete tickets)
//DELETE api/tickets/:id
router.delete("/:id", [auth, admin], async (req, res) => {
    try {
        const ticket = await Ticket.findOneAndDelete({ id: req.params.id });
        if (!ticket) { return res.status(404).json({ message: "Ticket not found."})};

        res.status(200).json({ ticket: ticket });

    } catch (err) {
        res.status(500).json({ message: "Server Error: "+err.message});
    }
})

export default router;