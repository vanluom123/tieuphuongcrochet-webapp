'use client'

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { ROUTE_PATH } from "@/app/lib/constant";
import Profile from "@/app/components/profile/Profile";
import { User } from "@/app/lib/definitions";

export default function ProfilePage() {
    const { data: session, status } = useSession();

    console.log('Profile page - Session:', session);
    console.log('Profile page - Status:', status);
    
    if (status === 'unauthenticated') {
        redirect(`${ROUTE_PATH.LOGIN}?callbackUrl=${ROUTE_PATH.PROFILE}`);
    }

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-container">
            <Profile user={session?.user as User} />
        </div>
    );
} 