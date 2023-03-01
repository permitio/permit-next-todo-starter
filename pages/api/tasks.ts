// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'


export type Task = {
  text: string,
  isCompleted: boolean,
}

type Response = {
  message: string,
}

const tasks: Task[] = [
  {
    text: 'Learn Next.js',
    isCompleted: true,
  }, {
    text: 'Learn React.js',
    isCompleted: false,
  }, {
    text: 'Learn ReactNative',
    isCompleted: false,
  },
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Task | Task[] | Response>
) {
  if (req.method === 'POST') {
    tasks.push(req.body);
    res.status(200).json(req.body);
  }

  if (req.method === 'GET') {
    res.status(200).json(tasks);
  }
  if (req.method === 'DELETE') {
    const { id } = req.query,
      intId = parseInt(id as string);
    if (Number.isNaN(intId) || intId < 0 || intId >= tasks.length) {
      res.status(400).json({ message: 'invalid id' });
    }
    tasks.splice(intId, 1);
    res.status(200).json({ message: 'deleted' });
  }
  if (req.method === 'PUT') {
    const { id } = req.query,
      intId = parseInt(id as string);
    if (Number.isNaN(intId) || intId < 0 || intId >= tasks.length) {
      res.status(400).json({ message: 'invalid id' });
    }
    const { text, isCompleted } = req.body;
    tasks[intId] = { text, isCompleted };
    res.status(200).json({ text, isCompleted });
  }
  if (req.method === 'PATCH') {
    const { id } = req.query,
      intId = parseInt(id as string);
    if (Number.isNaN(intId) || intId < 0 || intId >= tasks.length) {
      res.status(400).json({ message: 'invalid id' });
    }
    const { isCompleted } = req.body;
    tasks[intId] = { ...tasks[intId], isCompleted };
    res.status(200).json({ ...tasks[intId] });
  }
}
