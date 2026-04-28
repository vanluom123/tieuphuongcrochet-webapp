"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { paymentService } from "@/app/lib/service/paymentService";
import { Spin, Typography, Result, Button } from "antd";
import { useSession } from "next-auth/react";
import { ROUTE_PATH, USER_ROLES } from "@/app/lib/constant";

const { Title, Text } = Typography;

export default function PremiumCapturePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const { update } = useSession();
  const hasCaptured = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
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
          // Update the session role to reflect Premium status
          await update({ role: USER_ROLES.PREMIUM_USER });
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
  }, [token, update]);

  return (
    <div
      style={{
        minHeight: "calc(100vh - 200px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fdf9f4", // surface color
      }}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "24px",
          padding: "48px",
          boxShadow: "0 8px 32px rgba(28, 28, 25, 0.08)",
          border: "1px solid rgba(217, 193, 188, 0.2)",
          textAlign: "center",
          maxWidth: "480px",
          width: "100%",
        }}
      >
        {status === "loading" && (
          <>
            <Spin size="large" style={{ marginBottom: "24px" }} />
            <Title level={3} style={{ color: "#8e4838", fontFamily: "'Noto Serif', serif" }}>
              Processing your upgrade...
            </Title>
            <Text style={{ color: "#665a4a" }}>
              Please wait while we confirm your payment with PayPal. Do not close this page.
            </Text>
          </>
        )}

        {status === "success" && (
          <Result
            status="success"
            title={
              <span style={{ color: "#8e4838", fontFamily: "'Noto Serif', serif", fontWeight: 600 }}>
                Welcome to Premium!
              </span>
            }
            subTitle={
              <span style={{ color: "#665a4a" }}>
                Your payment was successful and your account has been upgraded. Enjoy the ad-free experience and exclusive patterns.
              </span>
            }
            extra={[
              <Button
                key="home"
                type="primary"
                size="large"
                onClick={() => router.push(ROUTE_PATH.HOME)}
                style={{
                  backgroundColor: "#8e4838",
                  borderColor: "#8e4838",
                  borderRadius: "12px",
                  fontWeight: 600,
                  boxShadow: "0 4px 12px rgba(142, 72, 56, 0.2)",
                }}
              >
                Go to Homepage
              </Button>,
            ]}
          />
        )}

        {status === "error" && (
          <Result
            status="error"
            title={
              <span style={{ color: "#8e4838", fontFamily: "'Noto Serif', serif", fontWeight: 600 }}>
                Upgrade Failed
              </span>
            }
            subTitle={
              <span style={{ color: "#665a4a" }}>
                There was an issue processing your payment. Your account was not charged. Please try again.
              </span>
            }
            extra={[
              <Button
                key="retry"
                type="primary"
                size="large"
                onClick={() => router.push(ROUTE_PATH.HOME)} // Could also go back to profile or retry
                style={{
                  backgroundColor: "#8e4838",
                  borderColor: "#8e4838",
                  borderRadius: "12px",
                  fontWeight: 600,
                  boxShadow: "0 4px 12px rgba(142, 72, 56, 0.2)",
                }}
              >
                Return Home
              </Button>,
            ]}
          />
        )}
      </div>
    </div>
  );
}
