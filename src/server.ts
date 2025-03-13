import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import supplierRoutes from './routes/SupplierRoutes';
import storeRoutes from './routes/StoreRoutes';
import orderRoutes from './routes/OrderRoutes';
import { setupSwagger } from './swagger';
import loginRoutes from "./routes/LoginRoutes"
import verifyJWT from './middleware/authMiddleware';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

setupSwagger(app);

app.use('/api', supplierRoutes);
app.use('/api', storeRoutes);
app.use('/api', orderRoutes);
app.use('/api',loginRoutes)

app.get('/api/profile', verifyJWT, (req, res) => {
  res.json({ message: 'Perfil protegido', user: req.user });
});



const { Pool } = require('pg');

const pool = new Pool({
    user: 'powerbi',
    host: '10.2.10.49',
    database: 'postgres',
    password: 'Tapaj0s-D4ta',
    port: 5432
});

pool.connect()
    .then((client: any) => {
        console.log("Conectado ao PostgreSQL!");
        client.release();
        pool.end();
    })
    .catch((err: any) => console.error("Erro de conexão:", err));



const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});