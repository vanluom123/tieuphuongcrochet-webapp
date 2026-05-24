"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { paymentService } from "@/app/lib/service/paymentService";
import { Spin, Typography, Result, Button } from "antd";
import { useSession } from "next-auth/react";
import { ROUTE_PATH, USER_ROLES } from "@/app/lib/constant";
import styles from "./page.module.scss";

const { Title, Text } = Typography;

export default function PremiumCapturePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const { status: sessionStatus, update } = useSession();
  const hasCaptured = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    // Wait for session to be loaded before attempting payment capture.
    // The update() function silently returns early when session is still loading,
    // which would cause the role update to be skipped.
    if (sessionStatus === "loading") {
      return;
    }

    if (hasCaptured.current) {
      return;
    }
    hasCaptured.current = true;

    const capturePayment = async () => {
      try {
        const response = await paymentService.capturePayment({ orderId: token });
        if (response && response.status === "SUCCESS") {
          // Update the session role to reflect Premium status.
          // update() only works when the session is already loaded (not in loading state).
          // It returns the updated session on success, or null on failure.
          const updatedSession = await update({ role: USER_ROLES.PREMIUM_USER });

          if (updatedSession?.user?.role !== USER_ROLES.PREMIUM_USER) {
            // If client-side update failed, force a hard session refresh
            // by navigating with a full page reload so the server re-reads
            // the JWT with the updated role from the backend.
            console.warn(
              "Session update did not reflect premium role. Forcing session refresh."
            );
          }

          // Invalidate Router Cache so the server re-fetches fresh session data
          router.refresh();
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch (error) {
        console.error("Error capturing payment:", error);
        setStatus("error");
      }
    };

    capturePayment();
  }, [token, sessionStatus, update, router]);

  const successExtra = useMemo(() => [
    <Button
      key="home"
      type="primary"
      size="large"
      onClick={() => (window.location.href = ROUTE_PATH.HOME)}
      className={styles.captureButton}
    >
      Go to Homepage
    </Button>,
  ], []);

  const errorExtra = useMemo(() => [
    <Button
      key="retry"
      type="primary"
      size="large"
      onClick={() => router.push(ROUTE_PATH.HOME)}
      className={styles.captureButton}
    >
      Return Home
    </Button>,
  ], [router]);

  return (
    <div className={styles.captureContainer}>
      <div className={styles.captureCard}>
        {status === "loading" && (
          <>
            <Spin size="large" className={styles.captureSpin} />
            <Title level={3} className={styles.captureTitle}>
              Processing your upgrade...
            </Title>
            <Text className={styles.captureText}>
              Please wait while we confirm your payment with PayPal. Do not close this page.
            </Text>
          </>
        )}

        {status === "success" && (
          <Result
            status="success"
            title={
              <span className={styles.captureResultTitle}>
                Welcome to Premium!
              </span>
            }
            subTitle={
              <span className={styles.captureResultSubtitle}>
                Your payment was successful and your account has been upgraded. Enjoy the ad-free experience and exclusive patterns.
              </span>
            }
            extra={successExtra}
          />
        )}

        {status === "error" && (
          <Result
            status="error"
            title={
              <span className={styles.captureResultTitle}>
                Upgrade Failed
              </span>
            }
            subTitle={
              <span className={styles.captureResultSubtitle}>
                There was an issue processing your payment. Your account was not charged. Please try again.
              </span>
            }
            extra={errorExtra}
          />
        )}
      </div>
    </div>
  );
}
