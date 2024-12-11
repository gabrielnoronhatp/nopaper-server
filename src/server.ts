import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import supplierRoutes from './routes/SupplierRoutes';
import { setupSwagger } from './swagger';

dotenv.config();

const app = express();

app.use(cors());

setupSwagger(app);

app.use('/api', supplierRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});