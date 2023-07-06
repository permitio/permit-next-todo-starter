import { getSession } from '@auth0/nextjs-auth0';
import { useUser } from '@auth0/nextjs-auth0/client';
import { permit } from '../api/tasks'
import { redirect } from 'next/dist/server/api-utils';

export default function Sync() {
    return <div>Syncing with Permit</div>;
}

export async function getServerSideProps({ req, res }: any) {
    const session = await getSession(req, res);
    // check if user exists in permit
    const user = await permit.api.getUser(session?.user?.sub);
    if (user) {
        console.log('user exists');
        redirect(res, 302, '/');
        return { props: {} };
    }
    const permitUserObj = {
        email: session?.user?.email,
        key: session?.user?.sub,
        first_name: session?.user?.name,
    }
    const permitUser = await permit.api.syncUser(permitUserObj);
    // check if user has roles
    if (session?.user['my_app_name/roles']) {
        session?.user['my_app_name/roles'].map(async (roleKey: string) => {
            console.log(roleKey);
            const roleToAssign = {
                role: roleKey,
                user: permitUserObj.key,
                tenant: 'default'
            }
            const assignedRole = await permit.api.assignRole(roleToAssign);
            console.log(assignedRole);
        });
    }
    redirect(res, 302, '/');
}