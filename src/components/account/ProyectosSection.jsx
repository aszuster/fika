"use client";

import { useState, useTransition } from "react";
import Button from "@/components/buttons/Button";
import {
  createProject,
  renameProject,
  deleteProject,
  requestQuote,
} from "@/app/mi-cuenta/actions";
import { getProductBySlug } from "@/data/products";

const itemLabel = ({ product_slug, variant_slug }) => {
  const product = getProductBySlug(product_slug);
  const variant = product?.variants.find((v) => v.slug === variant_slug);
  return `${product?.title ?? product_slug} — ${variant?.name ?? variant_slug}`;
};

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  dateStyle: "short",
  timeStyle: "short",
});

const ProyectosSection = ({ projects, quoteRequests }) => {
  const [isPending, startTransition] = useTransition();
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [confirmingProject, setConfirmingProject] = useState(null);
  const [justRequestedId, setJustRequestedId] = useState(null);

  const handleCreate = () => {
    if (!newName.trim()) return;
    startTransition(async () => {
      await createProject(newName.trim());
      setNewName("");
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

  const handleConfirmQuote = () => {
    const projectId = confirmingProject.id;
    startTransition(async () => {
      await requestQuote(projectId);
      setConfirmingProject(null);
      setJustRequestedId(projectId);
      setTimeout(() => setJustRequestedId(null), 4000);
    });
  };

  return (
    <div className="px-7.25 py-10 flex flex-col gap-10">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
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
        </div>

        {projects.length === 0 ? (
          <p className="by-sm text-secondary-02">
            Todavía no tenés proyectos.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {projects.map((project) => {
              const itemCount = project.project_items?.length ?? 0;

              return (
                <div
                  key={project.id}
                  className="flex items-center justify-between gap-4 border-b border-primary-01 pb-4"
                >
                  {editingId === project.id ? (
                    <input
                      type="text"
                      value={editingName}
                      onChange={(event) => setEditingName(event.target.value)}
                      className="by-sm border-b border-primary-00 bg-transparent py-1 outline-none"
                    />
                  ) : (
                    <p className="by-sm">
                      {project.name}{" "}
                      <span className="text-secondary-02">
                        ({itemCount} productos)
                      </span>
                      {justRequestedId === project.id && (
                        <span className="text-secondary-02"> — cotización enviada ✓</span>
                      )}
                    </p>
                  )}

                  <div className="flex items-center gap-4">
                    {editingId === project.id ? (
                      <>
                        <Button
                          copy="Guardar"
                          variant="secondary"
                          disabled={isPending}
                          onClick={handleRename}
                        />
                        <Button
                          copy="Cancelar"
                          variant="secondary"
                          onClick={() => setEditingId(null)}
                        />
                      </>
                    ) : (
                      <>
                        <Button
                          copy="Pedir cotización"
                          variant="secondary"
                          disabled={isPending || itemCount === 0}
                          onClick={() => setConfirmingProject(project)}
                        />
                        <Button
                          copy="Editar"
                          variant="secondary"
                          onClick={() => startEditing(project)}
                        />
                      </>
                    )}
                    <Button
                      copy="Eliminar"
                      variant="secondary"
                      disabled={isPending}
                      onClick={() =>
                        startTransition(() => deleteProject(project.id))
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
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
      </div>

      {confirmingProject && (
        <div className="fixed inset-0 z-20 bg-primary-00/40 flex items-center justify-center">
          <div className="bg-primary-03 border border-primary-00 w-full max-w-120 p-7.25 flex flex-col gap-6">
            <p className="hl-sm uppercase">
              Pedir cotización de &quot;{confirmingProject.name}&quot;
            </p>
            <p className="by-sm text-secondary-02">
              Se va a enviar esta lista para cotizar:
            </p>
            <ul className="by-sm flex flex-col gap-2">
              {confirmingProject.project_items.map((item) => (
                <li key={item.id}>{itemLabel(item)}</li>
              ))}
            </ul>
            <div className="flex gap-4">
              <Button
                copy={isPending ? "Enviando..." : "Confirmar y enviar"}
                variant="primary"
                disabled={isPending}
                onClick={handleConfirmQuote}
              />
              <Button
                copy="Cancelar"
                variant="secondary"
                disabled={isPending}
                onClick={() => setConfirmingProject(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProyectosSection;
