import { useTheme } from "@/context/theme-context";
import { FiMoon, FiSun } from "react-icons/fi";

type ThemeButtonProps = {
  className?: string;
};

export const ThemeButton = (props: ThemeButtonProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        theme == "dark" ? "Cambiar a tema claro" : "Cambiar a tema oscuro"
      }
      className={`p-2 rounded-full focus:outline-none focus:ring focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200 ${props.className}`}
    >
      {theme == "dark" ? (
        <FiSun className="w-5 h-5" />
      ) : (
        <FiMoon className="w-5 h-5" />
      )}
    </button>
  );
};
