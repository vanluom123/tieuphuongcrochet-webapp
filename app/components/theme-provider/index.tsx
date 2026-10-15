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
					colorPrimary: '#d43d3d',
					colorPrimaryHover: '#c93333',
					colorPrimaryActive: '#ad2b2b',
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