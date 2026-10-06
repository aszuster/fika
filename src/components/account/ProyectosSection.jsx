"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Button from "@/components/buttons/Button";
import { getFillerCount } from "@/components/grid/GridFillers";
import Pencil from "@/svg/Pencil";
import CotizacionScreen from "@/components/account/CotizacionScreen";
import {
  createProject,
  renameProject,
  deleteProject,
} from "@/app/mi-cuenta/actions";

const Cross = ({ position }) => (
  <Image
    src="/img/cross.svg"
    width={24}
    height={24}
    alt=""
    className={`pointer-events-none absolute left-0 z-5 -translate-x-[calc(50%+0.5px)] ${
      position === "bottom"
        ? "bottom-0 translate-y-[calc(50%+0.5px)]"
        : "top-0 -translate-y-1/2"
    }`}
  />
);

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  dateStyle: "short",
  timeStyle: "short",
});

const ProyectosSection = ({ projects, quoteRequests }) => {
  const [isPending, startTransition] = useTransition();
  const [newName, setNewName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [confirmingProject, setConfirmingProject] = useState(null);
  const [justRequestedId, setJustRequestedId] = useState(null);

  // Mientras se crea un proyecto, el cuadro borrador ocupa la siguiente celda
  // de la grilla, así que cuenta para los rellenos y las cruces.
  const cellCount = projects.length + (isCreating ? 1 : 0);
  const fillerCount = getFillerCount(cellCount, 3);
  const lastRow = Math.floor((cellCount + fillerCount - 1) / 3);
  const draftRow = Math.floor(projects.length / 3);
  const draftCol = projects.length % 3;

  const cancelCreating = () => {
    setIsCreating(false);
    setNewName("");
  };

  const handleCreate = () => {
    if (!newName.trim()) return;
    startTransition(async () => {
      await createProject(newName.trim());
      setNewName("");
      setIsCreating(false);
    });
  };

  const startEditing = (project) => {
    setEditingId(project.id);
    setEditingName(project.name);
  };

  const handleRename = () => {
    startTransition(async () => {
      await renameProject({ projectId: editingId, name: editingName.trim() });
      setEditingId(null);
    });
  };

  const handleQuoteRequested = (projectId) => {
    setConfirmingProject(null);
    setJustRequestedId(projectId);
    setTimeout(() => setJustRequestedId(null), 4000);
  };

  return (
    <>
      {/* <div className="flex flex-col gap-6"> */}
        {/* <div className="flex items-center gap-4">
          <input
            type="text"
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            placeholder="Nombre del nuevo proyecto"
            className="by-sm border-b border-primary-00 bg-transparent py-2 outline-none flex-1 max-w-90"
          />
          <Button
            copy="Crear proyecto"
            variant="secondary"
            disabled={isPending || !newName.trim()}
            onClick={handleCreate}
          />
        </div> */}

        {projects.length === 0 ? (
      <div className="flex h-[calc(100dvh-7.625rem)] relative w-full">
        <div className="w-full h-full relative">
          <div className="grid grid-cols-2 grid-rows-[3fr_7fr] bg-primary-03 gap-px w-full h-full">
          </div>
        </div>
        <div className="w-full h-full flex flex-col border-x border-primary-01">
          <div className="h-[33%] shrink-0 flex flex-col justify-center items-center">
            <h2 className="hl-lg uppercase">Proyectos</h2>
          </div>
          <div className="flex-1 min-h-0 w-full overflow-y-auto flex flex-col ">
            <div className="h-full border-y border-primary-00 flex justify-center items-center">
              <p className="by-sm text-secondary-01 font-normal! text-center max-w-70">
                Creá tu proyecto, sumá productos desde Favoritos y solicitá un presupuesto cuando completes tu selección.
              </p>
            </div>
            <div className="h-full flex justify-center items-end">
              <div>
              <Button
                copy="Crear proyecto"
                url="/"
                variant="tertiary"
                className="mb-20 font-normal!"
              />
              </div>
            </div>
          </div>
        </div>
        <div className="w-full h-full relative">
          <div className="grid grid-cols-2 grid-rows-[3fr_7fr] bg-primary-03 gap-px w-full h-full">

          </div>
        </div>
      </div>
        ) : (
          <div className="flex flex-col w-full min-h-[calc(100dvh-7.625rem)] overflow-x-clip">
            <div className="h-59 shrink-0 w-full grid grid-cols-3 gap-px bg-primary-01">
              <div className="bg-primary-03 "></div>
              <div className="flex items-center justify-center bg-primary-03">
                <h2 className="hl-lg uppercase text-primary-00 z-10 ">Proyectos</h2>
              </div>
              <div className="bg-primary-03 h-full "></div>
            </div>
            <div className="relative z-1 grid grid-cols-3 gap-px bg-primary-01 border-t border-primary-01">
              {projects.map((project, index) => {
                const items = project.project_items ?? [];
                const itemCount = items.length;
                const isEditing = editingId === project.id;
                const row = Math.floor(index / 3);
                const col = index % 3;

                return (
                  <div
                    key={project.id}
                    className="relative flex flex-col bg-primary-03 ring-1 ring-primary-00"
                  >
                    {row > 0 && col > 0 && <Cross position="top" />}
                    {row === lastRow && col > 0 && <Cross position="bottom" />}
                    <div className="h-17.5 shrink-0  w-full flex flex-col items-center justify-center px-4">

                    </div>
                    <div className="flex flex-col gap-2 p-8.25 min-h-62.75">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editingName}
                          onChange={(event) => setEditingName(event.target.value)}
                          className="hl-sm uppercase text-center border-b border-primary-00 bg-transparent py-1 outline-none w-full "
                        />
                      ) : (
                        <p className="hl-sm uppercase text-center">
                          {project.name}
                        </p>
                      )}
                      <p className="btn-sm text-primary-00 text-center">
                       ({itemCount} productos)
                      </p>
                      {/* {itemCount > 0 && (
                        <ul className="by-sm flex flex-col gap-1">
                          {items.map((item) => (
                            <li key={item.id}>{itemLabel(item)}</li>
                          ))}
                        </ul>
                      )} */}
                    </div>
                    <div className="flex mt-auto border-t border-primary-00 h-12.5">
                      {isEditing ? (
                        <>
                          <Button
                            copy="Cancelar"
                            variant="primary"
                            onClick={() => setEditingId(null)}
                            className="bg-primary-03! border-r border-primary-00! text-primary-00! hover:bg-primary-00! hover:text-primary-03!"
                          />
                          <Button
                            copy="Guardar"
                            variant="primary"
                            disabled={isPending || !editingName.trim()}
                            onClick={handleRename}
                            className="bg-primary-03!  border-primary-00! text-primary-00! hover:bg-primary-00! hover:text-primary-03!"
                          />
                        </>
                      ) : (
                        <>
                          <Button
                            copy="Eliminar"
                            variant="primary"
                            disabled={isPending}
                            onClick={() =>
                              startTransition(() => deleteProject(project.id))
                            }
                            className="bg-primary-03!  border-r border-primary-00! text-primary-00! hover:bg-primary-00! hover:text-primary-03!"
                          />
                          <Button
                            copy="Editar"
                            variant="primary"
                            onClick={() => startEditing(project)}
                            className="bg-primary-03!  border-r border-primary-00! text-primary-00! hover:bg-primary-00! hover:text-primary-03!"
                          />
                          <Button
                            copy="Cotizar"
                            variant="primary"
                            disabled={isPending || itemCount === 0}
                            onClick={() => setConfirmingProject(project)}
                            className="bg-primary-03! border-primary-00! text-primary-00! enabled:hover:bg-primary-00! enabled:hover:text-primary-03! disabled:text-secondary-02!"
                          />
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
              {isCreating && (
                <div className="relative flex flex-col bg-primary-03 ring-1 ring-primary-00">
                  {draftRow > 0 && draftCol > 0 && <Cross position="top" />}
                  {draftRow === lastRow && draftCol > 0 && <Cross position="bottom" />}
                  <div className="h-17.5 shrink-0  w-full flex flex-col items-center justify-center px-4">

                  </div>
                  <div className="flex flex-col items-center gap-2 p-8.25 min-h-62.75">
                    <div className="flex items-center gap-3 max-w-full">
                    <input
                      type="text"
                      autoFocus
                      value={newName}
                      size={Math.max(newName.length, "Nombre del proyecto".length)}
                      onChange={(event) => setNewName(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") handleCreate();
                        if (event.key === "Escape") cancelCreating();
                      }}
                      placeholder="Nombre del proyecto"
                      className="hl-sm uppercase text-secondary-02 bg-transparent py-1 outline-none field-sizing-content min-w-0 max-w-full"
                    />
                    <Pencil/>
                    </div>
                    <p className="btn-sm text-secondary-02 text-center">
                      (0 productos)
                    </p>
                  </div>
                  <div className="flex mt-auto border-t border-primary-00 h-12.5">
                    <Button
                      copy="Cancelar"
                      variant="primary"
                      disabled={isPending}
                      onClick={cancelCreating}
                      className="bg-primary-03! border-r border-primary-00! text-primary-00! enabled:hover:bg-primary-00! enabled:hover:text-primary-03! disabled:text-secondary-02!"
                    />
                    <Button
                      copy={isPending ? "Creando..." : "Crear"}
                      variant="primary"
                      disabled={isPending || !newName.trim()}
                      onClick={handleCreate}
                      className="bg-primary-03!  border-primary-00! text-primary-00! enabled:hover:bg-primary-00! enabled:hover:text-primary-03! disabled:text-secondary-02!"
                    />
                  </div>
                </div>
              )}
              {Array.from({ length: fillerCount }, (_, fillerIndex) => {
                const absoluteIndex = cellCount + fillerIndex;
                const row = Math.floor(absoluteIndex / 3);
                const col = absoluteIndex % 3;

                return (
                  <div key={`filler-${fillerIndex}`} className="relative bg-primary-03 flex items-end justify-center">
                    <div className="h-12.5 w-full border-t border-primary-01"></div>
                    {row > 0 && col > 0 && <Cross position="top" />}
                    {row === lastRow && col > 0 && <Cross position="bottom" />}
                  </div>
                );
              })}
            </div>
            <div className="relative flex-1 min-h-0 overflow-hidden">
              <div className="absolute inset-0 pt-px grid grid-cols-3 gap-px auto-rows-87 content-start bg-primary-01">
                {Array.from({ length: 12 }, (_, cellIndex) => (
                  <div key={cellIndex} className="relative bg-primary-03">
                    {cellIndex >= 3 && cellIndex % 3 > 0 && <Cross position="top" />}
                  </div>
                ))}
              </div>
            </div>
            <div className="h-24.25 shrink-0" />
            <div className="fixed bottom-0 inset-x-0 z-10 h-24.25 bg-primary-03 border-t border-primary-00 flex items-center justify-between gap-4 pl-12.5">
              <p className="btn-sm text-secondary-02 font-normal!">
                Tenés <span className="text-primary-00">{projects.length} {projects.length === 1 ? "proyecto" : "proyectos"} </span>
                {projects.length === 1 ? "creado" : "creados"}
              </p>
              <div className="h-full ">              <Button
                copy="Crear nuevo proyecto"
                variant="primary"
                disabled={isCreating}
                onClick={() => setIsCreating(true)}
                className="px-12.5 bg-primary-03! h-full border-l border-primary-00! text-primary-00! enabled:hover:bg-primary-00! enabled:hover:text-primary-03! disabled:text-secondary-02!"
              /></div>


            </div>
          </div>
        )}
      {/* </div> */}

      {/* <div className="flex flex-col gap-4">
        <p className="hl-xs uppercase">Cotizaciones pedidas</p>
        {quoteRequests.length === 0 ? (
          <p className="by-sm text-secondary-02">
            Todavía no pediste ninguna cotización.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {quoteRequests.map((quoteRequest) => (
              <div key={quoteRequest.id} className="border-b border-primary-01 pb-4">
                <p className="by-sm">
                  {quoteRequest.project_name}{" "}
                  <span className="text-secondary-02">
                    — {dateFormatter.format(new Date(quoteRequest.created_at))}
                  </span>
                </p>
                <ul className="by-sm text-secondary-02">
                  {quoteRequest.quote_request_items.map((item) => (
                    <li key={item.id}>
                      {item.product_title} — {item.variant_name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div> */}

      {confirmingProject && (
        <CotizacionScreen
          key={confirmingProject.id}
          project={confirmingProject}
          onClose={() => setConfirmingProject(null)}
          onRequested={handleQuoteRequested}
        />
      )}
    </>
  );
};

export default ProyectosSection;
