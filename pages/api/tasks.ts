// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Permit } from 'permitio';

const permit = new Permit({
  pdp: "http://localhost:7766",
  token: process.env.PERMIT_SDK_TOKEN,
});

export type Task = {
  text: string,
  isCompleted: boolean,
}

type Response = {
  message: string,
}

