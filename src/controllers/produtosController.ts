import { Request, Response } from "express";
import { prismaClient } from "../../prisma/prisma.ts";

export const createProduto = async (req: Request, res: Response) => {
    try {
        const { nome, precoCents } = req.body;
        if (!nome || precoCents == null) {
            return res.status(400).json({ error: "nome e precoCents são obrigatórios" });
        }
        const prod = await prismaClient.produto.create({
            data: { nome, precoCents: Number(precoCents) },
        });
        return res.status(201).json(prod);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "erro ao criar produto" });
    }
};

export const listProdutos = async (_: Request, res: Response) => {
    const prods = await prismaClient.produto.findMany({ orderBy: { id: "asc" } });
    return res.json(prods);
};
