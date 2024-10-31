// Thêm 'use client' nếu có sử dụng client-side features
'use client';

import { useEffect } from 'react';

export default function DashboardPage() {
    useEffect(() => {
        // Log để kiểm tra xem component có được render không
        console.log('Dashboard page mounted');
    }, []);

    return (
        <div className="p-4">
            <h1>Dashboard</h1>
            {/* Nội dung dashboard */}
        </div>
    );
}