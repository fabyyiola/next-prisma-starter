import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../config/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const direcciones = await prisma.direcciones.findMany();
      res.status(200).json(direcciones);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch direcciones' });
    }
  } else if (req.method === 'POST') {
    const { Nombre, Calle, Ciudad, Estado, CodigoPostal, Referencias } = req.body;
    try {
      const newDireccion = await prisma.direcciones.create({
        data: { Nombre, Calle, Ciudad, Estado, CodigoPostal, Referencias },
      });
      res.status(201).json(newDireccion);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create direccion' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
