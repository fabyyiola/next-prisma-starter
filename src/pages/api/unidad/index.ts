import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../config/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const unidades = await prisma.unidades.findMany();
      res.status(200).json(unidades);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch unidades' });
    }
  } else if (req.method === 'POST') {
    const {
      NoEconomico,
      Placas,
      Marca,
      Modelo,
      Tipo,
      VerMecanica,
      VerContaminantes,
      VerUS,
      PolizaUS,
      PolizaMX
    } = req.body;
    try {
      const newUnidad = await prisma.unidades.create({
        data: {
          NoEconomico,
          Placas,
          Marca,
          Modelo,
          Tipo,
          VerMecanica,
          VerContaminantes,
          VerUS,
          PolizaUS,
          PolizaMX
        },
      });
      res.status(201).json(newUnidad);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create unidad' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
