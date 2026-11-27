"use client";

import Select from "@/components/forms/Select";
import FieldError from "@/components/forms/FieldError";
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

// Campo con su mensaje de error abajo (dentro de la misma fila con borde).
const Field = ({ error, errorId, className = "", children }) => (
  <div className={`border-b border-primary-01 ${className}`}>
    {children}
    <FieldError id={errorId} message={error} />
  </div>
);

const TextField = ({ label, error, className = "", ...props }) => (
  <Field error={error} errorId={`${props.id}-error`} className={className}>
    <input
      {...props}
      required={undefined}
      aria-required={props.required}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${props.id}-error` : undefined}
      placeholder={props.required ? `*${label}` : label}
      className="by-sm w-full bg-transparent outline-none py-2 2xl:py-3.75 px-5"
    />
  </Field>
);

// Formulario de datos de envío. El estado y la validación los maneja
// CompletarPedido, que lo envía junto con los chips elegidos.
export default function MuestrasForm({
  form,
  errors = {},
  onChange,
  onBlur,
  onSubmit,
}) {
  const fieldProps = (name) => ({
    id: name,
    value: form[name],
    error: errors[name],
    onChange: (event) => onChange(name, event.target.value),
    onBlur: () => onBlur?.(name),
  });

  return (
    <div className="flex w-full">
      {/* Columnas vacías a los costados solo en desktop. */}
      <div className="hidden lg:block w-40 shrink-0 border-r  border-primary-00"></div>
      <form
        noValidate
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
            {...fieldProps("fullName")}
            label="Nombre y Apellido"
            type="text"
            required
            autoComplete="name"
          />
          <TextField
            {...fieldProps("email")}
            label="Mail de contacto"
            type="email"
            required
            autoComplete="email"
          />
          <TextField
            {...fieldProps("phone")}
            label="Teléfono"
            type="tel"
            required
            autoComplete="tel"
          />
          <TextField
            {...fieldProps("instagram")}
            label="Instagram del profesional / empresa / estudio"
            type="text"
          />
          <Field error={errors.province}>
            <Select
              value={form.province}
              onChange={(value) => onChange("province", value)}
              options={PROVINCIAS}
              placeholder="*Provincia"
              className="by-sm bg-transparent py-2 2xl:py-3.75 pl-5 pr-7"
            />
          </Field>
          <TextField
            {...fieldProps("address")}
            label="Dirección"
            type="text"
            required
            autoComplete="street-address"
          />
          <TextField
            {...fieldProps("postalCode")}
            label="Código Postal"
            type="text"
            required
            autoComplete="postal-code"
            className="border-primary-00!"
          />
        </div>
        {/* Botón invisible: permite enviar con Enter desde cualquier campo. */}
        <button type="submit" hidden />
      </form>
      <div className="hidden lg:block w-40 shrink-0 border-l  border-primary-00"></div>
    </div>
  );
}
