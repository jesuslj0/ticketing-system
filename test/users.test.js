import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';
import server from '../server.js';
import User from '../models/User.js';

describe('Users API Test', () => { //Describe el conjunto de pruebas o tests
    beforeAll(() => User.deleteMany()) //Se ejecuta antes de todos
    
    afterAll(() => { // Se ejecuta después de todo
        server.close() //Cerrar el servidor
        mongoose.connection.close(); //Desconectar la conexión de mongoose
    })

    test('Create a new user', async () => { //Test para crear un usuario
        const response = await request(app)
            .post('/api/users/signup')
            .send({
                name: 'Test user',
                email: 'test_jest@gmail.com',
                password: '12345678',
                role: 'user',
            })
        
        expect(response.status).toBe(201); //HTTP Status Code esperado
        expect(response.body).toHaveProperty('user'); //Contiene user
        expect(response.body).toHaveProperty('token'); //Contine el token
    });

    test('Login with user', async () => { //Test de login
        const response = await request(app)
        .post('/api/users/login')
        .send({
            email: 'test_jest@gmail.com',
            password: '12345678',
        })

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    })
})