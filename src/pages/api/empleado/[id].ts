import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../config/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const empleado = await prisma.empleados.findUnique({ where: { ID: Number(id) } });
      if (empleado) {
        res.status(200).json(empleado);
      } else {
        res.status(404).json({ error: 'Empleado not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch empleado' });
    }
  } else if (req.method === 'PUT') {
    const {
      Nombre,
      Direccion,
      Telefono,
      NombreConyuge,
      TelefonoConyuge,
      CURP,
      RFC,
      AptoMedico,
      Licencia,
      Tipo,
      SueldoSemanal,
    } = req.body;
    try {
      const updatedEmpleado = await prisma.empleados.update({
        where: { ID: Number(id) },
        data: {
          Nombre,
          Direccion,
          Telefono,
          NombreConyuge,
          TelefonoConyuge,
          CURP,
          RFC,
          AptoMedico,
          Licencia,
          Tipo,
          SueldoSemanal,
        },
      });
      res.status(200).json(updatedEmpleado);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update empleado' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.empleados.delete({ where: { ID: Number(id) } });
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete empleado' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
