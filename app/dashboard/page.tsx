'use client'
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { ROUTE_PATH } from "../lib/constant"
import Link from "next/link";

const Dashboard = () => {
    const { data: session, status } = useSession()

    console.log('session Dashboard', session);
    if (status === "authenticated") {
        return (
            <div>Admin Dashboard page
                <div>
                    <p>Email: {session?.user?.email}</p>
                </div>
            </div>
        )
    }

    return (
        <div>Admin Dashboard page
            <div>
                <Link href={ROUTE_PATH.LOGIN}>Login</Link>
            </div>
        </div>
    )
}

Dashboard.auth = {
    required: true,
    onUnauthenticated() {
        redirect(`${ROUTE_PATH.LOGIN}?callbackUrl=${ROUTE_PATH.DASHBOARD}`)
    }
};

export default Dashboard;