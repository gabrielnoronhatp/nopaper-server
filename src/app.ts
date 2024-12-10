    import express from 'express';
    import bodyParser from 'body-parser';
import cors from 'cors';
import orderRoutes from './routes/OrderRoutes';

const app = express();

    app.use(cors());
    app.use(bodyParser.json());
    app.use('/api', orderRoutes);

    export default app;
