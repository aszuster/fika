"use client";

import { useState, useTransition } from "react";
import Button from "@/components/buttons/Button";
import { updateProfile } from "@/app/mi-cuenta/actions";
import { PROFESSIONAL_ACTIVITIES } from "@/data/profile";

const FIELDS = [
  { name: "full_name", label: "Nombre" },
  {
    name: "professional_activity",
    label: "Actividad profesional",
    select: true,
  },
  { name: "company", label: "Empresa" },
  { name: "website_or_instagram", label: "Web / Instagram" },
  { name: "phone", label: "Teléfono" },
  { name: "country", label: "País" },
  { name: "state_province", label: "Provincia" },
  { name: "city", label: "Localidad" },
];

const initialValues = (profile) =>
  Object.fromEntries(FIELDS.map(({ name }) => [name, profile?.[name] ?? ""]));

const PerfilSection = ({ profile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [values, setValues] = useState(() => initialValues(profile));
  const [isPending, startTransition] = useTransition();

  const handleChange = (name, value) =>
    setValues((prev) => ({ ...prev, [name]: value }));

  const handleSave = () => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) =>
      formData.set(key, value)
    );

    startTransition(async () => {
      await updateProfile(formData);
      setIsEditing(false);
    });
  };

  const handleCancel = () => {
    setValues(initialValues(profile));
    setIsEditing(false);
  };

  return (
    <div className="max-w-160 px-7.25 py-10 flex flex-col gap-6">
      {FIELDS.map(({ name, label, select }) => (
        <div key={name} className="flex flex-col gap-1">
          <p className="by-sm text-secondary-02">{label}</p>
          {isEditing ? (
            select ? (
              <select
                value={values[name]}
                onChange={(event) => handleChange(name, event.target.value)}
                className="by-sm border-b border-primary-00 bg-transparent py-2 outline-none"
              >
                <option value="">Seleccionar...</option>
                {PROFESSIONAL_ACTIVITIES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={values[name]}
                onChange={(event) => handleChange(name, event.target.value)}
                className="by-sm border-b border-primary-00 bg-transparent py-2 outline-none"
              />
            )
          ) : (
            <p className="by-sm">{values[name] || "—"}</p>
          )}
        </div>
      ))}

      <div className="flex gap-4">
        {isEditing ? (
          <>
            <Button
              copy={isPending ? "Guardando..." : "Guardar"}
              variant="primary"
              onClick={handleSave}
              disabled={isPending}
            />
            <Button
              copy="Cancelar"
              variant="secondary"
              onClick={handleCancel}
              disabled={isPending}
            />
          </>
        ) : (
          <Button
            copy="Editar"
            variant="secondary"
            onClick={() => setIsEditing(true)}
          />
        )}
      </div>
    </div>
  );
};

export default PerfilSection;
