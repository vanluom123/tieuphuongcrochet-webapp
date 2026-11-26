"use client";

import "@ant-design/v5-patch-for-react-19";
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
				/* here is your component tokens */
				components: {
					Segmented: {
						itemSelectedBg: '#fecdcd',
					},
				},

			}}
		>
			{children}
		</ConfigProvider>
	);
}