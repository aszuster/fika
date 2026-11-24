"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/buttons/Button";
import Select from "@/components/forms/Select";
import { PROVINCIAS, MUESTRAS_CONTACTO_KEY } from "@/data/muestras";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  instagram: "",
  province: "",
  address: "",
  postalCode: "",
};

const TextField = ({ label, className = "", ...props }) => (
  <input
    {...props}
    placeholder={props.required ? `*${label}` : label}
    className={`by-sm w-full bg-transparent outline-none border-b border-primary-01 py-2 2xl:py-3.75 px-5 ${className}`}
  />
);

export default function MuestrasForm() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);

  const setField = (name) => (event) =>
    setForm((prev) => ({ ...prev, [name]: event.target.value }));

  const isValid =
    form.fullName.trim() !== "" &&
    form.email.trim() !== "" &&
    form.phone.trim() !== "" &&
    form.province !== "" &&
    form.address.trim() !== "" &&
    form.postalCode.trim() !== "";

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isValid) return;
    try {
      sessionStorage.setItem(MUESTRAS_CONTACTO_KEY, JSON.stringify(form));
    } catch {}
    router.push("/muestras/elegir");
  };

  return (
    <>
      <div className="flex w-full pb-22.5">
      <div className="w-40 shrink-0 border-r border-y border-primary-00"></div>
      <form onSubmit={handleSubmit} className="flex-1 min-w-0 flex flex-col justify-between ">
        <div className="border-t border-primary-00">
          <TextField
            id="fullName"
            label="Nombre y Apellido"
            type="text"
            required
            autoComplete="name"
            value={form.fullName}
            onChange={setField("fullName")}
          />
          <TextField
            id="email"
            label="Mail de contacto"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={setField("email")}
          />
          <TextField
            id="phone"
            label="Teléfono"
            type="tel"
            required
            autoComplete="tel"
            value={form.phone}
            onChange={setField("phone")}
          />
          <TextField
            id="instagram"
            label="Instagram del profesional / empresa / estudio"
            type="text"
            value={form.instagram}
            onChange={setField("instagram")}
          />
          <Select
            value={form.province}
            onChange={(value) =>
              setForm((prev) => ({ ...prev, province: value }))
            }
            options={PROVINCIAS}
            placeholder="*Provincia"
            className="by-sm border-b border-primary-01 bg-transparent py-2 2xl:py-3.75 pl-5 pr-7"
          />
          <TextField
            id="address"
            label="Dirección"
            type="text"
            required
            autoComplete="street-address"
            value={form.address}
            onChange={setField("address")}
          />
          <TextField
            id="postalCode"
            label="Código Postal"
            type="text"
            required
            autoComplete="postal-code"
            value={form.postalCode}
            onChange={setField("postalCode")}
            className="border-primary-00!"
          />
        </div>
        {/* Botón invisible: permite enviar con Enter desde cualquier campo. */}
        <button type="submit" hidden />
      </form>
      <div className="w-40 shrink-0 border-l border-y border-primary-00"></div>
      </div>

      <Button
        copy="Elegir muestras"
        variant="tertiary"
        disabled={!isValid}
        onClick={handleSubmit}
        className="mx-auto"
      />
    </>
  );
}
