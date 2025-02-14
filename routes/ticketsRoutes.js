import express from 'express';
import Ticket from '../models/Ticket.js';

const router = express.Router();

// GET api/tickets/
router.get("/", async (req, res) => {
    try {
        const tickets = await Ticket.find();
        if (!tickets) {
            res.status(400).json({ message: "Server Error: "+ req.errored.message })
        } else if(tickets.length == 0) {res.status(200).json({ tickets: []})}//Enviar un array vacío
        return res.status(200).json({ tickets: tickets }); //Enviar los tickets

    } catch (error) {
        res.status(500).json({ message: "Server Error "+error.message})
    }
})

//POST api/tickets/
router.post("/", async (req, res) => {
    const newTicket = new Ticket({
        user: req.body.user,
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

//GET api/tickets/id
router.get("/:id", async (req, res) => {
    try {
        const ticket = await Ticket.findOne({ id: req.params.id });
        if (!ticket) return res.status(404).json({ message: "Ticket not found."});

        res.status(200).json({ ticket: ticket})
    } catch (err) {
        res.status(500).json({ message: "Server Error: "+err.message});
    }
})

//PUT api/tickets/:id
router.put("/:id", async (req, res) => {
    const update = req.body;

    try {
        const ticket = await Ticket.findOneAndUpdate({ id: req.params.id }, update, { new: true });
        if (!ticket) { return res.status(404).json({ message: "Ticket not found."})};
        
        res.status(200).json({ ticket: ticket});

    } catch (error) {
        res.status(500).json({ message: "Server Error: "+err.message});
    }
})

//DELETE api/tickets/:id
router.delete("/:id", async (req, res) => {
    try {
        const ticket = await Ticket.findOneAndDelete({ id: req.params.id });
        if (!ticket) { return res.status(404).json({ message: "Ticket not found."})};

        res.status(200).json({ ticket: ticket });

    } catch (err) {
        res.status(500).json({ message: "Server Error: "+err.message});
    }
})

export default router;