import express from "express";
import authRouter from "./routes/authRoutes.ts";
import { auth } from "./middleware/auth.ts";
import userRouter from "./routes/userRoutes.ts";
import pedidosRouter from "./routes/pedidosRoutes.ts";
import produtosRouter from "./routes/produtosRoutes.ts";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/health", (_req, res) => {
    res.send("API RODANDO");
});

// Auth públicas
app.use(authRouter);

// Produtos (pode proteger se quiser): 
app.use(produtosRouter);

// A partir daqui, se quiser, pode aplicar auth global também
// app.use(auth);

// Rotas privadas (já protegi dentro do router de pedidos)
app.use(userRouter);
app.use(pedidosRouter);

app.listen(PORT, () => {
    console.log(`Server port ${PORT}`);
});
