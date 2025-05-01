// src/app.ts
import express from 'express';
import mongoose from 'mongoose';
import userRouter from '@/routes/user.routes';
async function bootstrap() {
    const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/db';

    mongoose.connection.on('connecting', () => {
        console.log('⚙️  Mongoose connecting…');
    });
    mongoose.connection.on('connected', () => {
        console.log('✅ Mongoose connected (event)');
    });
    mongoose.connection.on('error', err => {
        console.error('❌ Mongoose connection error (event):', err);
    });
    mongoose.connection.on('disconnected', () => {
        console.log('🔌 Mongoose disconnected (event)');
    });

    try {
        console.log(`➡️  mongoose.connect('${MONGO_URI}')`);
        await mongoose.connect(MONGO_URI);
        console.log('✅ mongoose.connect() resolved');
    } catch (err) {
        console.error('❌ mongoose.connect() rejected:', err);
        process.exit(1);
    }

    const app = express();

    app.use((req, _, next) => {
        console.log(`→ ${req.method} ${req.originalUrl}`);
        next();
    });

    app.use(express.json());
    app.use('/', userRouter);

    const PORT = process.env.PORT || 4200;
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}

bootstrap();
