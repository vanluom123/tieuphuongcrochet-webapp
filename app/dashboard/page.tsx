'use client'
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { ROUTE_PATH } from "../lib/constant";

const Dashboard = () => {
    const session = useSession({
        required: true,
        onUnauthenticated() {
            redirect(`${ROUTE_PATH.LOGIN}?callbackUrl=${ROUTE_PATH.DASHBOARD}`)
        }
    })

    return (
        <div>Admin Dashboard page
            <div>
                <p>Email: {session.data?.user?.email}</p>
            </div>
        </div>
    )
}

export default Dashboard;
