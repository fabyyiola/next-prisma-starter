import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../config/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const client = await prisma.clientes.findUnique({ where: { ID: Number(id) } });
      if (client) {
        res.status(200).json(client);
      } else {
        res.status(404).json({ error: 'Client not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch client' });
    }
  } else if (req.method === 'PUT') {
    const { Nombre, Calle, Ciudad, Estado, CodigoPostal, RFC, RegimenFiscal } = req.body;
    try {
      const updatedClient = await prisma.clientes.update({
        where: { ID: Number(id) },
        data: { Nombre, Calle, Ciudad, Estado, CodigoPostal, RFC, RegimenFiscal },
      });
      res.status(200).json(updatedClient);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update client' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.clientes.delete({ where: { ID: Number(id) } });
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete client' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
