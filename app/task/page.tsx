// Example for dashboard or task page
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function task() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/login");
        }
        // You could optionally decode and verify token here too
    }, []);

    return (
        <div>
            <h1>Welcome to the taskboard</h1>
            {/* Add actual EMS content here */}
        </div>
    );
}
