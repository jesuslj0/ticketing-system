import request from 'supertest'
import app from '../app.js'
import server from '../server.js'
import Ticket from '../models/Ticket.js'
import User from '../models/User.js'
import mongoose from 'mongoose'

describe("Tickets API Test", () => {
    let token;
    let admin_token;

    async function createUsers() {
        const user = await request(app).post("/api/users/signup") // Crear usuario
            .send({
                name: "User Test 1",
                email: "test123@gmail.com",
                password: "12345678",
            });

        const admin = await request(app).post("/api/users/signup") // Crear usuario
        .send({
            name: "Admin Test 1",
            email: "admin123@gmail.com",
            role: "admin",
            password: "12345678"
        });

        const loginResponse = await request(app).post("/api/users/login") // Autenticar usuario
            .send({
                email: "test123@gmail.com",
                password: "12345678",
            });

        const adminLoginResponse = await request(app).post("/api/users/login") // Autenticar usuario
        .send({
            email: "admin123@gmail.com",
            password: "12345678",
        });

        token = loginResponse.body.token;  
        admin_token = adminLoginResponse.body.token;
    }

    beforeAll(async () => {
        // Borrar los datos antes de empezar
        await User.deleteMany();
        await Ticket.deleteMany();

        // Crear usuarios antes de las pruebas
        await createUsers();
    });

    afterAll(async () => {
        await server.close(); // Cerrar el servidor
        await mongoose.connection.close(); // Cerrar la conexión a la base de datos
    });

    // Test de creación de ticket
    test("Create a new ticket", async () => {
        const response = await request(app)
            .post("/api/tickets")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Ticket 1",
                description: "Test description",
                status: "open",
                priority: "low"
            });

        const response2 = await request(app)
            .post("/api/tickets")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Ticket 2",
                description: "Test description 2",
                status: "open",
                priority: "medium"
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("ticket");
        expect(response.body.ticket).toHaveProperty("user");
    });

    // Test Obtener todos los tickets
    test("Get all tickets", async () => {
        const response = await request(app).get("/api/tickets");

        expect(response.body).toHaveProperty("results");
        expect(response.body.results.length).toBe(2);
        expect(response.body).toHaveProperty("total");
        expect(response.body).toHaveProperty("pages");
        expect(response.body).toHaveProperty("currentPage");
    });

    //Test editar un ticket (solo usuarios loggeados)
    test("Update a ticket by ID", async () => {
        let ticket_id;
        //Obtener un id
        const ticket = await Ticket.findOne({title: "Ticket 1"})
        ticket_id = ticket.id

        const response = await request(app)
            .put(`/api/tickets/${ticket_id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: 'Title Updated',
                description: 'Description updated',
                priority: 'high',
            })
        
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('ticket');
        expect(response.body.ticket.title).toBe("Title Updated")
        expect(response.body.ticket.priority).toBe("high")
    })

    //Test borrar un ticket (solo admins)
    test("Delete a ticket (as Admin)", async () => {
        let ticket_id;
        //Obtener un id
        const ticket = await Ticket.findOne({title: "Ticket 2"})
        ticket_id = ticket.id

        const response = await request(app) //Peticiión de borrado con el token del admin
            .delete(`/api/tickets/${ticket_id}`)
            .set('Authorization', `Bearer ${admin_token}`)
            .send({})

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('ticket');
        expect(response.body.ticket).toHaveProperty('title');
    })
});