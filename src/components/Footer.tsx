import { Mail } from "lucide-react";
import { SiGithub, SiLinkedin } from "react-icons/si";

export function Footer() {
  return (
    <footer className="bg-muted mt-8 w-full">
      <div className="container mx-auto px-6 md:px-8">
        <div className="flex flex-col items-start py-8 space-y-6">
          <div className="flex flex-col items-start space-y-2">
            <h3 className="text-lg font-semibold text-primary">
              {/* Contact */}
            </h3>
          </div>

          <div className="flex justify-start items-center gap-8">
            <a
              href="mailto:jaeuu.dev@gmail.com"
              className="text-primary hover:text-primary/80 transition-colors"
              aria-label="Email"
            >
              <Mail className="h-6 w-6" />
            </a>
            <a
              href="https://github.com/nullisdefined"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors"
              aria-label="GitHub"
            >
              <SiGithub className="h-6 w-6" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors"
              aria-label="LinkedIn"
            >
              <SiLinkedin className="h-6 w-6" />
            </a>
          </div>
        </div>

        <div className="border-t border-muted-foreground/20 dark:border-muted-foreground/30 pb-5 pt-4">
          <div className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              © 2024 Jaewoo Kim. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
