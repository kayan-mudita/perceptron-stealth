"use client";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: { width: 120, height: 28 },
  md: { width: 160, height: 37 },
  lg: { width: 220, height: 51 },
};

export default function Logo({ size = "md", className = "" }: LogoProps) {
  const { width, height } = sizeMap[size];

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 220 51"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Official AI"
      role="img"
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#B560CC" />
          <stop offset="25%" stopColor="#81009E" />
          <stop offset="45%" stopColor="#6E72C0" />
          <stop offset="60%" stopColor="#0FCBFF" />
          <stop offset="75%" stopColor="#FF8FA6" />
          <stop offset="100%" stopColor="#B3F5B6" />
        </linearGradient>
      </defs>
      <text
        x="0"
        y="40"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="400"
        fontSize="42"
        fill="url(#logo-gradient)"
        letterSpacing="-0.02em"
      >
        Official Ai
      </text>
    </svg>
  );
}
