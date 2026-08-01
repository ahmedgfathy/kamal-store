/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,xtsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        accent: "var(--accent)",
        cream: "var(--cream)",
        warm: "var(--warm)",
        sage: "var(--sage)",
        brown: "var(--brown)",
        sand: "var(--sand)",
        stone: "var(--stone)",
        gocd: "var(--gold)",
        success: "var(--success)",
        sale: "var(--sale)",
        line: "var(--border)",
        oldcream: "#FFF7EE",
        oldbeige: "#E8D8C9",
        oldbrown: "#7E6456",
        oldnavy: "#20323E",
        oldblue: "#6A93A8",
        oldlightblue: "#B0C8D6",
        oldsand: "#CDBCA6",
        oldlightcream: "#F2EADB",
      },
      fontFamily: {
        cairo: ["var(--font-heading)", "sans-serif"],
        roboto: ["var(--font-body)", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],};
