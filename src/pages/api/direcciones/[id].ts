import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../config/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const direccion = await prisma.direcciones.findUnique({ where: { ID: Number(id) } });
      if (direccion) {
        res.status(200).json(direccion);
      } else {
        res.status(404).json({ error: 'Direccion not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch direccion' });
    }
  } else if (req.method === 'PUT') {
    const { Nombre, Calle, Ciudad, Estado, CodigoPostal, Referencias } = req.body;
    try {
      const updatedDireccion = await prisma.direcciones.update({
        where: { ID: Number(id) },
        data: { Nombre, Calle, Ciudad, Estado, CodigoPostal, Referencias },
      });
      res.status(200).json(updatedDireccion);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update direccion' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.direcciones.delete({ where: { ID: Number(id) } });
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete direccion' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
