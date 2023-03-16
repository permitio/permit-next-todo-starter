import type { NextApiRequest, NextApiResponse } from 'next';


export type Task = {
  text: string,
  isCompleted: boolean,
  owner: string,
}

type Response = {
  message: string,
}

const tasks: Task[] = [
  {
    text: 'Learn Next.js',
    isCompleted: true,
    owner: 'admin'
  }, {
    text: 'Learn React.js',
    isCompleted: false,
    owner: 'admin'
  }, {
    text: 'Learn ReactNative',
    isCompleted: false,
    owner: 'admin'
  },
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Task | Task[] | Response>
) {
  switch (req.method) {
    case 'POST': {
      tasks.push(req.body);
      res.status(200).json(req.body);
      break;
    }

    case 'GET': {
      res.status(200).json(tasks);
      break;
    }

    case 'DELETE': {
      const { id } = req.query,
        intId = parseInt(id as string);
      if (Number.isNaN(intId) || intId < 0 || intId >= tasks.length) {
        res.status(400).json({ message: 'invalid id' });
      }
      tasks.splice(intId, 1);
      res.status(200).json({ message: 'deleted' });
      break;
    }

    case 'PUT': {
      const { id } = req.query,
        intId = parseInt(id as string);
      if (Number.isNaN(intId) || intId < 0 || intId >= tasks.length) {
        res.status(400).json({ message: 'invalid id' });
      }
      const { text, isCompleted, owner } = req.body;
      tasks[intId] = { text, isCompleted, owner };
      res.status(200).json({ text, isCompleted, owner });
      break;
    }

    case 'PATCH': {
      const { id } = req.query,
        intId = parseInt(id as string);
      if (Number.isNaN(intId) || intId < 0 || intId >= tasks.length) {
        res.status(400).json({ message: 'invalid id' });
      }
      const { isCompleted } = req.body;
      tasks[intId] = { ...tasks[intId], isCompleted };
      res.status(200).json({ ...tasks[intId] });
      break;
    }

    default: {
      res.status(405).json({ message: 'method not allowed' });
      break;
    }
  }
}
