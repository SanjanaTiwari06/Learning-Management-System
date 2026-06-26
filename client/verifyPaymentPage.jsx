/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { useLocation, useNavigate } from 'react-router-dom';

const API_BASE = "http://localhost:4000"

const VerifyPaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { getToken } = useAuth();

    useEffect(() => {
        let cancelled = false;

        const verifyAndRedirect = async () => {
            const params = new URLSearchParams(location.search || "");
            const rawSession = params.get("session_id");
            const session_id = rawSession ? rawSession.trim() : null;

            // Stripe sends the user here (no session_id) when checkout is cancelled
            if (!session_id) {
                if (!cancelled) navigate("/MyCourses?payment_status=Unpaid", { replace: true });
                return;
            }

            let clerkToken = null;
            try {
                clerkToken = await getToken();
            } catch (e) {
                clerkToken = null;
            }

            const headers = { "Content-Type": "application/json" };
            if (clerkToken) headers["Authorization"] = `Bearer ${clerkToken}`;

            try {
                const res = await fetch(
                    `${API_BASE}/api/booking/confirm?session_id=${encodeURIComponent(session_id)}`,
                    { method: "GET", headers, credentials: "include" }
                );
                const data = await res.json().catch(() => ({}));

                if (cancelled) return;

                if (res.ok && data?.success) {
                    navigate("/MyCourses?payment_status=Paid", { replace: true });
                } else {
                    navigate("/MyCourses?payment_status=Unpaid", { replace: true });
                }
            } catch (error) {
                console.error("Payment verification failed:", error);
                if (!cancelled) navigate("/MyCourses?payment_status=Unpaid", { replace: true });
            }
        };

        verifyAndRedirect();

        return () => {
            cancelled = true;
        };
    }, [location.search, navigate, getToken]);

    return (
        <div
            style={{
                minHeight: "60vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.05rem",
                color: "#4b5563",
            }}
        >
            Confirming your payment...
        </div>
    );
}

export default VerifyPaymentPage;
