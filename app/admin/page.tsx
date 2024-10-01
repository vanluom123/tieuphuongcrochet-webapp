'use client'
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { API_ROUTES, ROUTE_PATH } from "../lib/constant";
import { useEffect } from "react";

const Dashboard =  () => {
    const session = useSession({
        required: true,
        onUnauthenticated() {
            redirect(`${ROUTE_PATH.LOGIN}?callbackUrl=${ROUTE_PATH.ADMIN}`)
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
