import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../config/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const usuarios = await prisma.usuarios.findMany();
      res.status(200).json(usuarios);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch usuarios' });
    }
  } else if (req.method === 'POST') {
    const { Nombre, Email, Accesos, Administrador } = req.body;
    try {
      const newUsuario = await prisma.usuarios.create({
        data: { Nombre, Email, Accesos, Administrador },
      });
      res.status(201).json(newUsuario);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create usuario' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
