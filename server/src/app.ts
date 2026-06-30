import express, { Application, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();
import { HttpError } from './errors/http-error';
import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/Product.routes";
import artisanRoutes from "./routes/artisan.route";

const app: Application = express();

/* CORS configuration (merged from both versions) */
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3003', 'http://localhost:3005'], 
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));


/* Body parser middleware */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


/* Serve static public folder */
app.use(
  "/uploads/profile_pictures",
  express.static(path.join(__dirname, "../public/profile_pictures"))
);


app.use(
  "/uploads/products",
  express.static(path.join(__dirname, "../public/products"))
);

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/artisans", artisanRoutes);


// app.use(
//   "/uploads/orders",
//   express.static(path.join(__dirname, "../public/orders"))
// );
//users


/* Root route */
app.get('/', (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: 'Welcome to the API',
  });
});

/* Global error handler */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({ success: false, message: err.message });
  }
  return res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

export default app;