/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";

export default {
  content: ["./views/public/**/*.{html,js,jsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    daisyui
  ],
  daisyui: {
    themes: ["light", "dark"],
  },
}

