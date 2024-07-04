import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../config/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const regimenFiscales = await prisma.regimenFiscal.findMany();
      res.status(200).json(regimenFiscales);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch regimen fiscales' });
    }
  } else if (req.method === 'POST') {
    const { Nombre } = req.body;
    try {
      const newRegimenFiscal = await prisma.regimenFiscal.create({
        data: {
          Nombre,
        },
      });
      res.status(201).json(newRegimenFiscal);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create regimen fiscal: ' + error });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
