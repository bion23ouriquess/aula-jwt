import { prismaClient } from "../../prisma/prisma.ts";
import type { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import type { Request, Response } from "express";
import { PedidoStatus } from "@prisma/client";

enum pedidoColumns {
  VALOR = "valor",
  STATUS = "status",
  USER_ID = "userId",
  CREATED_AT = "createdAt",
  UPDATED_AT = "updatedAt",
}

export const createPedido = async (req: Request, res: Response) => {
  try {
    const pedido = await prismaClient.pedido.create({
      data: {
        userId: req.userId!,             // amarra o pedido ao usuário do token
        valor: 0,                        // pode recalcular com base nos itens
        status: PedidoStatus.ABERTO,
      },
    });
    return res.status(201).json(pedido);
  } catch (error) {
    console.log(error);
    return res.status(500).send(`Erro no servidor: ${error}`);
  }
};

export const addProdutoAoPedido = async (req: Request, res: Response) => {
  const { id } = req.params; // pedidoId
  const { produtoId, quantidade = 1 } = req.body;

  try {
    const pedido = await prismaClient.pedido.findUnique({ where: { id: Number(id) } });
    if (!pedido || pedido.userId !== req.userId)
      return res.status(404).json({ error: "Pedido não encontrado" });

    const item = await prismaClient.pedido_produto.upsert({
      where: {
        pedidoId_produtoId: {
          pedidoId: Number(id),
          produtoId: Number(produtoId),
        },
      },
      update: { quantidade: { increment: Number(quantidade) } },
      create: {
        pedidoId: Number(id),
        produtoId: Number(produtoId),
        quantidade: Number(quantidade),
      },
      include: { produto: true },
    });

    return res.status(201).json(item);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "erro ao adicionar produto ao pedido" });
  }
};

export const listPedidos = async (req: Request, res: Response) => {
  try {
    const pedidos = await prismaClient.pedido.findMany({
      where: { userId: req.userId! },
      orderBy: { id: "asc" },
      include: {
        itens: { include: { produto: true } },
      },
    });

    const result = pedidos.map((p) => ({
      id: p.id,
      status: p.status,
      createdAt: p.createdAt,
      produtos: p.itens.map((i) => ({
        id: i.produto.id,
        nome: i.produto.nome,
        precoCents: i.produto.precoCents,
        quantidade: i.quantidade,
      })),
    }));

    return res.json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).send(`Erro no servidor: ${error}`);
  }
};

export const listPedidoById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const pedido = await prismaClient.pedido.findUnique({
      where: { id },
      include: { itens: { include: { produto: true } } },
    });
    if (!pedido || pedido.userId !== req.userId)
      return res.status(404).json({ error: "Pedido não encontrado" });

    return res.json(pedido);
  } catch (error) {
    console.log(error);
    return res.status(500).send(`Erro no servidor: ${error}`);
  }
};

export const updatePedido = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { valor, status } = req.body;

    const exists = await prismaClient.pedido.findUnique({ where: { id } });
    if (!exists || exists.userId !== req.userId)
      return res.status(404).json({ error: "Pedido não encontrado" });

    const updated = await prismaClient.pedido.update({
      where: { id },
      data: {
        valor: valor ?? exists.valor,
        status: status ?? exists.status,
      },
    });

    return res.json(updated);
  } catch (error) {
    console.log(error);
    return res.status(500).send(`Erro no servidor: ${error}`);
  }
};

export const deletePedido = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const exists = await prismaClient.pedido.findUnique({ where: { id } });
    if (!exists || exists.userId !== req.userId)
      return res.status(404).json({ error: "Pedido não encontrado" });

    await prismaClient.pedido.delete({ where: { id } });
    return res.status(204).send();
  } catch (error) {
    console.log(error);
    return res.status(500).send(`Erro no servidor: ${error}`);
  }
};

export const concluirPedido = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const pedido = await prismaClient.pedido.findUnique({ where: { id: Number(id) } });
    if (!pedido || pedido.userId !== req.userId)
      return res.status(404).json({ error: "Pedido não encontrado" });

    const atualizado = await prismaClient.pedido.update({
      where: { id: Number(id) },
      data: { status: PedidoStatus.CONCLUIDO },
    });

    return res.json({ message: "Pedido concluído com sucesso", pedido: atualizado });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "erro ao concluir pedido" });
  }
};
