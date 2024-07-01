import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../config/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const clients = await prisma.clientes.findMany();
      res.status(200).json(clients);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch clients' });
    }
  } else if (req.method === 'POST') {
    const { Nombre, Calle, Ciudad, Estado, CodigoPostal, RFC, RegimenFiscal } = req.body;
    try {
      const newClient = await prisma.clientes.create({
        data: { Nombre, Calle, Ciudad, Estado, CodigoPostal, RFC, RegimenFiscal },
      });
      res.status(201).json(newClient);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create client' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
