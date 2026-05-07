import { useTheme } from "@/hooks/useTheme";
import { useNavigate } from "react-router-dom";
import { Instagram } from "lucide-react";
import iconDark from "@/assets/icon-dark.svg";
import iconLight from "@/assets/icon-light.svg";

export default function Footer() {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    else navigate("/");
  };

  return (
    <footer
      className="border-t border-border bg-background/60 backdrop-blur-sm"
      role="contentinfo"
    >
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 focus:outline-none mb-3"
              aria-label="Ir al inicio DOTS"
            >
              <img
                src={theme === "dark" ? iconLight : iconDark}
                alt="Logo DOTS"
                className="h-6 w-auto"
                loading="lazy"
              />
            </button>
            <p className="text-sm text-muted-foreground font-body max-w-xs">
              El gimnasio para el pensamiento creativo.
            </p>
          </div>

          {/* Links */}
          <nav aria-label="Enlaces del pie de página">
            <h2 className="text-xs font-heading font-bold uppercase tracking-widest text-muted-foreground mb-4">
              Navegación
            </h2>
            <ul className="space-y-2 text-sm font-body">
              <li>
                <button
                  onClick={() => navigate("/")}
                  className="text-foreground hover:text-primary transition-colors"
                >
                  Inicio
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo("como-funciona")}
                  className="text-foreground hover:text-primary transition-colors"
                >
                  Cómo funciona
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/challenge")}
                  className="text-foreground hover:text-primary transition-colors"
                >
                  Reto del día
                </button>
              </li>
              <li>
                <a
                  href="mailto:hola@connectdots.es"
                  className="text-foreground hover:text-primary transition-colors"
                >
                  Contacto
                </a>
              </li>
            </ul>
          </nav>

          {/* Social */}
          <div>
            <h2 className="text-xs font-heading font-bold uppercase tracking-widest text-muted-foreground mb-4">
              Síguenos
            </h2>
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/connectdotsai/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram de DOTS"
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground hover:border-primary hover:text-primary transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.tiktok.com/@1connectdots2"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok de DOTS"
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground hover:border-primary hover:text-primary transition-colors font-heading text-xs font-bold"
              >
                TT
              </a>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground font-body">
            © {new Date().getFullYear()} DOTS. Todos los derechos reservados.
          </p>
          <p className="text-xs text-muted-foreground font-body">
            Hecho con creatividad en España
          </p>
        </div>
      </div>
    </footer>
  );
}
