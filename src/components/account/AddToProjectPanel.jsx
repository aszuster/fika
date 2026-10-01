"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import Button from "@/components/buttons/Button";
import Close from "@/svg/Close";
import { addFavoriteToProject } from "@/app/mi-cuenta/actions";
import { getProductBySlug } from "@/data/products";

// Mismo patrón que FiltersPanel: siempre montado, se anima solo con el
// transform/opacity según isOpen (nunca se desmonta), así el cierre también
// anima y el contenido (la última variante elegida) no desaparece de golpe.
const AddToProjectPanel = ({ isOpen, favorite, projects, onClose }) => {
  const [isPending, startTransition] = useTransition();
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [addedProjectIds, setAddedProjectIds] = useState(new Set());

  const product = favorite ? getProductBySlug(favorite.product_slug) : null;
  const variant = product?.variants.find(
    (v) => v.slug === favorite?.variant_slug
  );

  // Cada favorito que se abre en el panel arranca sin nada marcado como
  // agregado — si no, al reabrir con otra variante quedaría pegado el
  // estado "agregado" de la anterior.
  useEffect(() => {
    setAddedProjectIds(new Set());
    setIsCreating(false);
    setNewProjectName("");
  }, [favorite?.id]);

  const handleAddToExisting = (projectId) => {
    startTransition(async () => {
      await addFavoriteToProject({ favoriteId: favorite.id, projectId });
      setAddedProjectIds((prev) => new Set(prev).add(projectId));
    });
  };

  const handleCreateAndAdd = () => {
    const name = newProjectName.trim();
    if (!name) return;

    startTransition(async () => {
      const result = await addFavoriteToProject({
        favoriteId: favorite.id,
        newProjectName: name,
      });
      if (result?.projectId) {
        setAddedProjectIds((prev) => new Set(prev).add(result.projectId));
      }
      setNewProjectName("");
      setIsCreating(false);
    });
  };

  return (
    <>
      <motion.div
        initial={false}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        onClick={onClose}
        className={`fixed inset-x-0 top-18 bottom-0 z-20 bg-primary-00/40 ${
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      />
      <motion.div
        initial={false}
        animate={{ x: isOpen ? 0 : "100%" }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="fixed top-18 right-0 z-30 w-160 bg-primary-03 h-[calc(100dvh-4.5rem)] border-l border-primary-00 flex flex-col"
      >
        <div className="h-12.5 shrink-0 border-b border-primary-00 flex items-center justify-between px-7.5">
          <p className="hl-xs uppercase">Agregar a proyecto</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="cursor-pointer"
          >
            <Close />
          </button>
        </div>

        <div className="h-60 shrink-0 border-b border-primary-00 flex flex-col items-center justify-center gap-4 p-6">
          <div className="relative h-36 w-full">
            {variant && (
              <Image
                src={variant.catalogPhoto ?? product?.image}
                alt=""
                fill
                sizes="40vw"
                className="object-contain"
              />
            )}
          </div>
          <p className="hl-sm uppercase text-center">
            {variant?.name ?? favorite?.variant_slug}
          </p>
          <p className="by-sm font-normal! text-secondary-02">Agregá este producto a tus proyectos</p>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto flex flex-col">
          {projects.map((project) => (
            <div
              key={project.id}
              className="h-12.5 shrink-0 border-b border-primary-01 flex items-center justify-between px-7.5"
            >
              <p className="hl-sm uppercase">{project.name}</p>
              {addedProjectIds.has(project.id) ? (
                <p className="by-sm text-secondary-00">Producto agregado</p>
              ) : (
                <Button
                  copy="Agregar"
                  variant="tertiary"
                  disabled={isPending}
                  onClick={() => handleAddToExisting(project.id)}
                />
              )}
            </div>
          ))}


        </div>
                  {isCreating ? (
            <div className="h-14.5 shrink-0 border-b border-primary-01 flex items-center justify-between px-7.5 gap-4">
              <input
                type="text"
                autoFocus
                value={newProjectName}
                onChange={(event) => setNewProjectName(event.target.value)}
                placeholder="Nombre del proyecto"
                className="by-sm bg-transparent outline-none border-b border-primary-00 flex-1 py-1"
              />
              <Button
                copy="Agregar"
                variant="tertiary"
                disabled={isPending || !newProjectName.trim()}
                onClick={handleCreateAndAdd}
              />
            </div>
          ) : (
            <div className="h-24.25 shrink-0 border-t border-primary-00 flex items-center justify-center px-7.5">
              <Button
                copy="Crear nuevo proyecto"
                variant="secondary"
                onClick={() => setIsCreating(true)}
              />
            </div>
          )}
      </motion.div>
    </>
  );
};

export default AddToProjectPanel;
