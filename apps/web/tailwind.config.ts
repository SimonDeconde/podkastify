// import type { Config } from 'tailwindcss';
import { nextui } from '@nextui-org/theme';

// const withMT = require('@material-tailwind/react/utils/withMT');

const config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/**/*.{js,ts,jsx,tsx}',
  ],
  important: true,
  theme: {
    extend: {},
  },
  plugins: [nextui()],
  darkMode: 'class',
};
export default config;
