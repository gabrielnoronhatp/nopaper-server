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



const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});