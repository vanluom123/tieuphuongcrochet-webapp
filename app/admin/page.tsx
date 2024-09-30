import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { ROUTE_PATH } from "../lib/constant";
import { getServerSession } from "next-auth";
import {options} from "../api/auth/[...nextauth]/options";

const Dashboard = async () => {
    const session = await getServerSession(options)

    if (!session) {
        redirect(`${ROUTE_PATH.LOGIN}?callbackUrl=${ROUTE_PATH.ADMIN}`)
    }

    return(
        <div>Admin Dashboard page
            <div>
                <p>Email: {session?.user?.email}</p>
            </div>
        </div>
    )
}

export default Dashboard;
