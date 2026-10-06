"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Button from "../buttons/Button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Plus from "@/svg/Plus";

const navItems = [
  {
    label: "Productos",
    url: "/",
    isActive: (pathname) =>
      pathname === "/" || pathname.startsWith("/productos"),
  },
  { label: "Colecciones", url: "" },
  { label: "Proyectos", url: "/proyectos" },
  { label: "Distribuidores", url: "" },
  { label: "Nosotros", url: "" },
  { label: "Boxes", url: "" },
];

const Navbar = () => {
  const pathname = usePathname();
  // null = todavía no sabemos si hay sesión. Evita que se vea "Iniciar
  // sesión" por un instante cuando en realidad la usuaria está logueada.
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data }) => {
      setIsLoggedIn(Boolean(data.session));
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsLoggedIn(Boolean(session));
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <nav className="sticky top-0 z-20 h-18 px-7.25 border-b border-primary-00 bg-primary-03">
      <div className="flex justify-between w-full h-full items-center">
        <Link href="/">
          <Image src="/img/logo.svg" width={67} height={25} alt="Fika logo" />
        </Link>
        <div>
          <ul className="flex gap-10.5">
            {navItems.map(({ label, url, isActive }) => {
              const active = isActive ? isActive(pathname) : pathname === url;

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
        <div className=" h-full flex items-center ">
          {isLoggedIn && (
            <Link
              href="/mi-cuenta?tab=favoritos"
              aria-label="Ver favoritos"
              className="pr-7.5 border-l pl-7.25 border-primary-00 h-full flex justify-center items-center"
            >
              <Plus />
            </Link>
          )}
          <div className="border-l border-primary-00 h-full flex items-center justify-center pl-7.5">
            <div className={`relative ${isLoggedIn === null ? "invisible" : ""}`}>
              <Button
                copy={isLoggedIn ? "Mi cuenta" : "Iniciar sesión"}
                url={isLoggedIn ? "/mi-cuenta" : "/ingresar"}
                variant="secondary"
                className="active:border-0! focus:border-0!"
              />
              {(pathname === "/mi-cuenta" || pathname === "/ingresar") && (
                <div className="absolute h-1 w-[70%] bg-primary-00 -bottom-5.5 left-1/2 -translate-x-1/2"></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
