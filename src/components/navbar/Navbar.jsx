"use client";
import Image from "next/image";
import Button from "../buttons/Button";
import Link from "next/link";


const Navbar = () => {
  return (
    <nav className="sticky top-0 z-20 h-18 px-7.25 border-b border-primary-00 bg-primary-03">
      <div className="flex justify-between w-full h-full items-center">
        <Link href=""><Image src="/img/logo.svg" width={67} height={25} alt="Fika logo" /></Link>
        <div>
          <ul className="flex gap-10.5">
            <li><Button copy="Productos" url="" variant="secondary"/></li>
            <li><Button copy="Colecciones" url="" variant="secondary"/></li>
            <li><Button copy="Proyectos" url="" variant="secondary"/></li>
            <li><Button copy="Distribuidores" url="" variant="secondary"/></li>
            <li><Button copy="Nosotros" url="" variant="secondary"/></li>
            <li><Button copy="Boxes" url="" variant="secondary"/></li>

          </ul>
        </div>
        <div className="border-l border-primary-00 h-full flex items-center pl-7.25"><Button copy="Iniciar sesión" url="" variant="secondary"/></div>
      </div>
    </nav>
  );
};

export default Navbar;
