"use client";

import * as React from "react";
import { ConfigProvider } from "antd";

type Props = {
  children: React.ReactNode;
};

export function ThemeProvider({ children }: Props) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#c42d47",
          colorInfo: "#2d5f8b",
          colorSuccess: "#3b6b5c",
          colorWarning: "#c27d2b",
          colorError: "#c93b3b",
          colorLink: "#c42d47",
          colorLinkHover: "#a32238",
          colorTextBase: "#1e1b1a",
          colorTextSecondary: "#665e59",
          colorTextTertiary: "#8c837d",
          colorBgLayout: "#fcfbfa",
          colorBgContainer: "#ffffff",
          colorBgElevated: "#ffffff",
          colorBorder: "#e8e2dc",
          colorBorderSecondary: "#efeae4",
          borderRadius: 8,
          borderRadiusLG: 14,
          borderRadiusSM: 6,
          fontFamily: "var(--font-body), system-ui, -apple-system, sans-serif",
          fontSize: 15,
          controlHeight: 40,
          controlHeightLG: 44,
        },
        components: {
          Button: {
            primaryShadow: "none",
            defaultShadow: "none",
            defaultBorderColor: "#d6cec5",
            defaultColor: "#1e1b1a",
            fontWeight: 500,
            borderRadius: 8,
            borderRadiusLG: 10,
          },
          Segmented: {
            trackBg: "#f5f2ee",
            itemSelectedBg: "#ffffff",
            itemSelectedColor: "#c42d47",
            itemColor: "#665e59",
            itemHoverColor: "#1e1b1a",
            borderRadius: 999,
            borderRadiusSM: 999,
          },
          Input: {
            activeBorderColor: "#c42d47",
            hoverBorderColor: "#d6cec5",
            activeShadow: "0 0 0 3px rgba(196, 45, 71, 0.12)",
          },
          Select: {
            activeBorderColor: "#c42d47",
            hoverBorderColor: "#d6cec5",
            activeOutlineColor: "rgba(196, 45, 71, 0.12)",
          },
          Tabs: {
            inkBarColor: "#c42d47",
            itemSelectedColor: "#c42d47",
            itemHoverColor: "#a32238",
            itemColor: "#665e59",
          },
          Modal: {
            borderRadiusLG: 16,
            titleColor: "#1e1b1a",
            headerBg: "#ffffff",
            contentBg: "#ffffff",
          },
          Pagination: {
            itemActiveBg: "#fdf0f2",
          },
          Tag: {
            borderRadiusSM: 999,
          },
          Tooltip: {
            colorBgSpotlight: "#1e1b1a",
            colorTextLightSolid: "#fcfbfa",
          },
          Menu: {
            itemSelectedColor: "#c42d47",
            itemSelectedBg: "#fdf0f2",
            itemHoverColor: "#c42d47",
            horizontalItemSelectedColor: "#c42d47",
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
