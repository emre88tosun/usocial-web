import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";
import colors from "tailwindcss/colors";
import { nextui } from "@nextui-org/react";
import typographyPlugin from "@tailwindcss/typography";

const config: Config = {
	content: ["./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/**/*.{js,ts,jsx,tsx,mdx}", "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"],
	darkMode: "class",
	theme: {
		fontFamily: {
			sans: ["Roboto", "sans-serif", ...fontFamily.sans],
		},
		extend: {
			colors: {
				...colors,
			},
			typography: {
				DEFAULT: {
					css: {
						maxWidth: "100%",
					},
				},
			},
			keyframes: {
				slideInX: {
					"0%": { opacity: "0", transform: "translateX(100%)" },
					"100%": {
						opacity: "1",
						transform: "translateX(0)",
					},
				},
				slideOutX: {
					"0%": { opacity: "1", transform: "translateX(0)" },
					"100%": {
						opacity: "0",
						transform: "translateX(-100%)",
					},
				},
			},
			animation: {
				slideInX: "slideInX 0.25s ease-in-out 0s 1 normal none",
				slideOutX: "slideOutX 0.25s forwards",
			},
		},
		screens: {
			xs: "0",
			sm: "576.1px",
			md: "768.1px",
			lg: "992.1px",
			xl: "1200.1px",
		},
	},
	plugins: [
		plugin(({ addVariant }) => {
			addVariant("not-last", "&:not(:last-child)");
			addVariant("not-first", "&:not(:first-child)");
		}),
		nextui({
			defaultTheme: "light",
		}),
		typographyPlugin(),
	],
};
export default config;
