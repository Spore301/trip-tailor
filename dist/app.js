import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { AppDataSource } from './db/data-source.js';
import tripRouter from './routes/trip.routes.js';
import aggregatorRouter from './routes/aggregator.routes.js';
import orchestratorRouter from './routes/orchestrator.routes.js';
const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use('/api/trip', tripRouter);
app.use('/api/aggregator', aggregatorRouter);
app.use('/api/orchestrator', orchestratorRouter);
const swaggerSpec = swaggerJSDoc({
    definition: {
        openapi: '3.0.0',
        info: { title: 'Trip Tailor API', version: '1.0.0' },
    },
    apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
});
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
export async function initApp() {
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }
    return app;
}
export default app;
//# sourceMappingURL=app.js.map