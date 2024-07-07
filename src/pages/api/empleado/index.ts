import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../config/prisma';
import { Empleado } from '@/types/schema.types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const empleados = await prisma.empleados.findMany();
      res.status(200).json(empleados);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch empleados' });
    }
  } else if (req.method === 'POST') {
    const { Nombre, Direccion, Telefono, Email, NombreConyuge, TelefonoConyuge, CURP, RFC, AptoMedico, Licencia, Tipo, SueldoSemanal } = req.body;
    try {
      const newEmpleado: Empleado = await prisma.empleados.create({
        data: { 
          Nombre, 
          Direccion, 
          Telefono, 
          Email: Email || '', // Handle the Email field
          NombreConyuge: NombreConyuge || '', 
          TelefonoConyuge: TelefonoConyuge || '', 
          CURP, 
          RFC, 
          AptoMedico: new Date(AptoMedico), 
          Licencia: new Date(Licencia), 
          Tipo, 
          SueldoSemanal:parseFloat(SueldoSemanal) 
        },
      });
      res.status(201).json(newEmpleado);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create empleado: ' + error });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
