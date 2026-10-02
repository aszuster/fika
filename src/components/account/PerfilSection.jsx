"use client";

import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import Button from "@/components/buttons/Button";
import TabBar from "./TabBar";
import AccessDataForm from "./AccessDataForm";
import { updateProfile } from "@/app/mi-cuenta/actions";
import { PROFESSIONAL_ACTIVITIES } from "@/data/profile";
import Select from "@/components/forms/Select";

const SUB_TABS = [
  { key: "personal-data", label: "Datos personales" },
  { key: "access-data", label: "Datos de acceso" },
];

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
  const searchParams = useSearchParams();
  const requestedSubTab = searchParams.get("subtab");
  const initialSubTab = SUB_TABS.some(({ key }) => key === requestedSubTab)
    ? requestedSubTab
    : "personal-data";

  const [activeSubTab, setActiveSubTab] = useState(initialSubTab);
  const [isEditing, setIsEditing] = useState(false);
  const [values, setValues] = useState(() => initialValues(profile));
  const [isPending, startTransition] = useTransition();

  const handleChange = (name, value) =>
    setValues((prev) => ({ ...prev, [name]: value }));

  const handleSave = () => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => formData.set(key, value));

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
    <div className="flex h-[calc(100dvh-7.625rem)] relative w-full">
      <div className="w-full h-full relative">
        <div className="grid grid-cols-2 grid-rows-[3fr_7fr] bg-primary-01 gap-px w-full h-full">
          <div className="bg-primary-03"></div>
          <div className="bg-primary-03"></div>
          <div className="bg-primary-03"></div>
          <div className="relative bg-primary-03"></div>
        </div>
      </div>
      <div className="w-full h-full flex flex-col border-x border-primary-01">
        <div className="h-[30%] shrink-0 flex flex-col justify-center items-center">
          <h2 className="hl-lg uppercase">Perfil</h2>
        </div>
        <div className="flex-1 min-h-0 w-full overflow-y-auto flex flex-col ">
          <TabBar
            tabs={SUB_TABS}
            activeTab={activeSubTab}
            onSelect={setActiveSubTab}
            fullWidth={false}
            className="border-x-0! border-t"
          />
          <div className="w-full">
            {activeSubTab === "personal-data" ? (
              <>
            {FIELDS.map(({ name, label, select }) => (
              <div key={name} className="flex flex-col gap-1 w-full">
                {isEditing ? (
                  select ? (
                    <Select
                      value={values[name]}
                      onChange={(value) => handleChange(name, value)}
                      options={PROFESSIONAL_ACTIVITIES}
                      placeholder="Seleccionar..."
                      className={`by-sm py-3 px-4 border-b border-primary-01 font-normal! ${
                        values[name] === (profile?.[name] ?? "")
                          ? "text-secondary-02"
                          : "text-primary-00"
                      }`}
                    />
                  ) : (
                    <input
                      type="text"
                      value={values[name]}
                      onChange={(event) =>
                        handleChange(name, event.target.value)
                      }
                      className={`by-sm py-3 px-5 border-b border-primary-01 font-normal! ${
                        values[name] === (profile?.[name] ?? "")
                          ? "text-secondary-02"
                          : "text-primary-00"
                      }`}
                    />
                  )
                ) : (
                  <p className="by-sm py-3 px-5 border-b border-primary-01 font-normal!">{values[name] || "—"}</p>
                )}
              </div>
            ))}
              </>
            ) : (
              <AccessDataForm />
            )}
          </div>
          {activeSubTab === "personal-data" && (
            <div className="flex flex-col gap-px">
              {isEditing ? (
                <div className="flex">
                  <Button
                    copy={isPending ? "Guardando..." : "Guardar cambios"}
                    variant="primary"
                    onClick={handleSave}
                    disabled={isPending}
                    className="bg-primary-03! border-y! border-r!  border-primary-00! text-primary-00! hover:bg-primary-00! hover:text-primary-03!"
                  />
                  <div className="w-full flex items-center justify-center">
                  <Button
                    copy="Cancelar"
                    variant="primary"
                    onClick={handleCancel}
                    disabled={isPending}
                    className="bg-primary-03! border-y!  border-primary-00! text-primary-00! hover:bg-primary-00! hover:text-primary-03!"
                  />
                  </div>
                </div>
              ) : (
                <div className="w-full flex items-center justify-center">
                <Button
                  copy="Editar"
                  variant="primary"
                  onClick={() => setIsEditing(true)}
                  className="bg-primary-03! border-y!  border-primary-00! text-primary-00! font-normal! hover:bg-primary-00! hover:text-primary-03!"
                />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="w-full h-full relative">
        <div className="grid grid-cols-2 grid-rows-[3fr_7fr] bg-primary-01 gap-px w-full h-full">
          <div className="bg-primary-03"></div>
          <div className="bg-primary-03"></div>
          <div className="bg-primary-03"></div>
          <div className="relative bg-primary-03"></div>
        </div>
      </div>
    </div>
  );
};

export default PerfilSection;
