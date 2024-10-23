'use client'
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { ROUTE_PATH } from "../lib/constant"
import { Button, Spin } from "antd";

const Dashboard = () => {
    const { data: session, status } = useSession()

    console.log('session Dashboard', session);
    return (
        <Spin size='large' tip='Loading...' spinning={status === 'loading'}>
            <div>
                Admin Dashboard page
                <div>
                    <p>Email: {session?.user?.email}</p>
                </div>
            </div>
            <Button type="primary" onClick={() => signOut()}>Sign out</Button>
        </Spin>
    )
}

Dashboard.auth = {
    required: true,
    onUnauthenticated() {
        redirect(`${ROUTE_PATH.LOGIN}?callbackUrl=${ROUTE_PATH.DASHBOARD}`)
    }
};

export default Dashboard;