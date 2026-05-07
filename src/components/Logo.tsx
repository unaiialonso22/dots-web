import { useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import logoDark from "@/assets/logo-dark.svg";
import logoLight from "@/assets/logo-light.svg";
import iconDark from "@/assets/icon-dark.svg";
import iconLight from "@/assets/icon-light.svg";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "full" | "icon";
}

export default function Logo({ className = "", size = "md", variant = "full" }: LogoProps) {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const sizeClasses = {
    sm: "h-6",
    md: "h-10",
    lg: "h-20",
  };

  const isDark = theme === "dark";
  const src = variant === "icon"
    ? (isDark ? iconLight : iconDark)
    : (isDark ? logoLight : logoDark);

  return (
    <button
      onClick={() => navigate("/")}
      className={`flex items-center focus:outline-none ${className}`}
      aria-label="Ir a la página principal"
    >
      <img
        src={src}
        alt="DOTS"
        className={`${sizeClasses[size]} w-auto`}
      />
    </button>
  );
}
