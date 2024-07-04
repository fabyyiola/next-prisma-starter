import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../config/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const regimenFiscal = await prisma.regimenFiscal.findUnique({ where: { ID: Number(id) } });
      if (regimenFiscal) {
        res.status(200).json(regimenFiscal);
      } else {
        res.status(404).json({ error: 'Regimen fiscal not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch regimen fiscal' });
    }
  } else if (req.method === 'PUT') {
    const { Nombre } = req.body;
    try {
      const updatedRegimenFiscal = await prisma.regimenFiscal.update({
        where: { ID: Number(id) },
        data: {
          Nombre,
        },
      });
      res.status(200).json(updatedRegimenFiscal);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update regimen fiscal' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.regimenFiscal.delete({ where: { ID: Number(id) } });
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete regimen fiscal' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
