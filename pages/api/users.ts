import { NextApiRequest, NextApiResponse } from "next";
import { Permit } from "permitio";
import { UserRead } from "permitio/build/main/openapi";

const permit = new Permit({
    pdp: "http://localhost:7766",
    token: process.env.PERMIT_SDK_TOKEN,
});

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<UserRead | UserRead[] | Response>
) {
    const users = await permit.api.listUsers();
    res.status(200).json(users);
}