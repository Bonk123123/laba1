import express from "express";
import cors from "cors";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import orderRouter from "./routes/orderRoute.js";

const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());
app.use(userRouter);
app.use(productRouter);
app.use(orderRouter);

app.listen(PORT, () => console.log("sasageyo"));
