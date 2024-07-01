import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../config/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const usuario = await prisma.usuarios.findUnique({ where: { ID: Number(id) } });
      if (usuario) {
        res.status(200).json(usuario);
      } else {
        res.status(404).json({ error: 'Usuario not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch usuario' });
    }
  } else if (req.method === 'PUT') {
    const { Nombre, Email, Accesos, Administrador } = req.body;
    try {
      const updatedUsuario = await prisma.usuarios.update({
        where: { ID: Number(id) },
        data: { Nombre, Email, Accesos, Administrador },
      });
      res.status(200).json(updatedUsuario);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update usuario' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.usuarios.delete({ where: { ID: Number(id) } });
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete usuario' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
