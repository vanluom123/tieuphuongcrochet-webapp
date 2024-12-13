'use client'

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { ROUTE_PATH } from "@/app/lib/constant";
import Profile from "@/app/(main)/profile/Profile";

export default function ProfilePage() {
    const { data: session, status } = useSession();

    if (status === 'unauthenticated') {
        redirect(`${ROUTE_PATH.LOGIN}?callbackUrl=${ROUTE_PATH.PROFILE}`);
    }

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-container">
            <Profile />
        </div>
    );
} 