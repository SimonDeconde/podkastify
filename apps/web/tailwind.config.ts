// import type { Config } from 'tailwindcss';
import { heroui } from '@heroui/react';

const config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    '../../node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  important: true,
  theme: {
    extend: {},
  },
  plugins: [heroui()],
  darkMode: 'class',
};
export default config;
