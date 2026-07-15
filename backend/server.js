import express from 'express'
import 'dotenv/config'
import connectDB from './database/db.js';
import userRoute from './routes/userRoute.js'
import productRoutes from './routes/productRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 8000; // Fallback to 8000 matching env

app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials:true
}))

app.use('/api/v1/user', userRoute)
app.use('/api/v1/product', productRoutes)
app.use('/api/v1/order', orderRoutes)

app.get('/api/v1/healthcheck', (req, res) => {
    res.json({ success: true, message: 'Server is healthy and routes are loaded' });
});

app.listen(PORT,()=>{
    connectDB()
    console.log(`server is listening at port:${PORT}`);
})