"use client";

import Select from "@/components/forms/Select";
import { PROVINCIAS } from "@/data/muestras";
import Corner from "@/svg/Corner";

export const initialForm = {
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

// Formulario de datos de envío. El estado lo maneja CompletarPedido, que lo
// envía junto con los chips elegidos.
export default function MuestrasForm({ form, onChange, onSubmit }) {
  const setField = (name) => (event) => onChange(name, event.target.value);

  return (
    <div className="flex w-full">
      <div className="w-40 shrink-0 border-r  border-primary-00"></div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
        className="flex-1 min-w-0 flex flex-col justify-between relative"
      >
        <div className="absolute -top-0.5 -left-0.5">
        <Corner/>
        </div>
        <div className="absolute -rotate-90 -bottom-0.5 -left-0.5">
        <Corner/>
        </div>
        <div className="absolute rotate-90 -top-0.5 -right-0.5">
        <Corner/>
        </div>
        <div className="absolute rotate-180 -bottom-0.5 -right-0.5">
        <Corner/>
        </div>
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
            onChange={(value) => onChange("province", value)}
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
      <div className="w-40 shrink-0 border-l  border-primary-00"></div>
    </div>
  );
}
