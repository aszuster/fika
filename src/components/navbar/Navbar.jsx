"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Button from "../buttons/Button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const navItems = [
  {
    label: "Productos",
    url: "/",
    isActive: (pathname) => pathname === "/" || pathname.startsWith("/productos"),
  },
  { label: "Colecciones", url: "" },
  { label: "Proyectos", url: "/proyectos" },
  { label: "Distribuidores", url: "" },
  { label: "Nosotros", url: "" },
  { label: "Boxes", url: "" },
];

const Navbar = () => {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data }) => {
      setIsLoggedIn(Boolean(data.session));
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsLoggedIn(Boolean(session));
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <nav className="sticky top-0 z-20 h-18 px-7.25 border-b border-primary-00 bg-primary-03">
      <div className="flex justify-between w-full h-full items-center">
        <Link href=""><Image src="/img/logo.svg" width={67} height={25} alt="Fika logo" /></Link>
        <div>
          <ul className="flex gap-10.5">
            {navItems.map(({ label, url, isActive }) => {
              const active = isActive
                ? isActive(pathname)
                : pathname === url;

              return (
                <li key={label} className="relative">
                  <Button copy={label} url={url} variant="secondary" />
                  {active && (
                    <div className="absolute h-1 w-[70%] bg-primary-00 -bottom-5.5 left-1/2 -translate-x-1/2"></div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="border-l border-primary-00 h-full flex items-center gap-4 pl-7.25">
          {isLoggedIn && (
            <Link
              href="/mi-cuenta?tab=favoritos"
              aria-label="Ver favoritos"
              className="w-6 h-6 rounded-full border border-primary-00 flex items-center justify-center btn-sm cursor-pointer hover:bg-primary-00 hover:text-primary-03 transition-colors duration-300 ease-in-out"
            >
              +
            </Link>
          )}
          <Button
            copy={isLoggedIn ? "Mi cuenta" : "Iniciar sesión"}
            url={isLoggedIn ? "/mi-cuenta" : "/ingresar"}
            variant="secondary"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
