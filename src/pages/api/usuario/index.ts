import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../config/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { email } = req.query;

    if (email) {
      // Handle GET request to fetch user by email
      try {
        const decodedEmail = decodeURIComponent(email as string);
        const user = await prisma.usuarios.findUnique({
          where: { Email: decodedEmail },
        });
        if (user) {
          res.status(200).json(user);
        } else {
          res.status(404).json({ error: 'User not found' });
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
      }
    } else {
      // Handle GET request to fetch all users
      try {
        const users = await prisma.usuarios.findMany();
        res.status(200).json(users);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
      }
    }
  } else if (req.method === 'POST') {
    const { Nombre, Email, Accesos, Administrador, Estatus } = req.body;
    try {
      const newUser = await prisma.usuarios.create({
        data: { Nombre, Email, Accesos, Administrador, Estatus },
      });
      res.status(201).json(newUser);
    } catch (error) {
      console.error('Failed to create user:', error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
