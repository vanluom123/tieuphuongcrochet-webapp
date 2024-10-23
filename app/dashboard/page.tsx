'use client'
import { signOut, useSession } from "next-auth/react";
import { Button, Spin } from "antd";

const Page = () => {
    const { data: session, status } = useSession()

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


export default Page;