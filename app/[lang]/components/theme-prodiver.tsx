"use client";

import * as React from "react";
import { ConfigProvider } from "antd";

type Props = {
	children: React.ReactNode
}

export function ThemeProvider({ children }: Props) {
	return (
		<ConfigProvider
			theme={{
				token: {
					colorPrimary: '#fc8282',
				},
				cssVar: true,
				hashed: false,
			}}
		>
			{children}
		</ConfigProvider>
	);
}