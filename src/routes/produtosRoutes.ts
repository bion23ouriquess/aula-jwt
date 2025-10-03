import { Router } from "express";
import { createProduto, listProdutos } from "../controllers/produtosController.ts";

const produtosRouter = Router();

produtosRouter.post("/produtos", createProduto);
produtosRouter.get("/produtos", listProdutos);

export default produtosRouter;
