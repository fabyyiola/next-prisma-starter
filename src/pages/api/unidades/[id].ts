import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../config/prisma';
import { convertToISO8601 } from '@/utils/tools';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const unidad = await prisma.unidades.findUnique({ where: { ID: Number(id) } });
      if (unidad) {
        res.status(200).json(unidad);
      } else {
        res.status(404).json({ error: 'Unidad not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch unidad' });
    }
  } else if (req.method === 'PUT') {
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
      const updatedUnidad = await prisma.unidades.update({
        where: { ID: Number(id) },
        data: {
          NoEconomico: parseInt(NoEconomico, 10),
          Placas,
          Marca,
          Modelo,
          Tipo,
          VerMecanica: convertToISO8601(VerMecanica),
          VerContaminantes: convertToISO8601(VerContaminantes),
          VerUS: convertToISO8601(VerUS),
          PolizaUS: convertToISO8601(PolizaUS),
          PolizaMX: convertToISO8601(PolizaMX),
        },
      });
      res.status(200).json(updatedUnidad);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update unidad: ' + error });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.unidades.delete({ where: { ID: Number(id) } });
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete unidad' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
