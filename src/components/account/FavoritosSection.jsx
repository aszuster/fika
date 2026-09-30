"use client";

import { useState, useTransition } from "react";
import Button from "@/components/buttons/Button";
import { removeFavorite, addFavoriteToProject } from "@/app/mi-cuenta/actions";

const FavoritosSection = ({ favorites, projects }) => {
  const [isPending, startTransition] = useTransition();
  const [selectedProject, setSelectedProject] = useState({});

  if (favorites.length === 0) {
    return (
      <div className="px-7.25 py-10">
        <p className="by-sm text-secondary-02">
          Todavía no tenés favoritos.
        </p>
      </div>
    );
  }

  const handleAddToProject = (favoriteId) => {
    const choice = selectedProject[favoriteId];
    if (!choice) return;

    startTransition(async () => {
      if (choice === "new") {
        const name = window.prompt("Nombre del proyecto");
        if (!name) return;
        await addFavoriteToProject({ favoriteId, newProjectName: name });
      } else {
        await addFavoriteToProject({ favoriteId, projectId: choice });
      }
    });
  };

  return (
    <div className="px-7.25 py-10 flex flex-col gap-4">
      {favorites.map((favorite) => (
        <div
          key={favorite.id}
          className="flex items-center justify-between gap-4 border-b border-primary-01 pb-4"
        >
          <p className="by-sm">
            {favorite.product_slug} — {favorite.variant_slug}
          </p>
          <div className="flex items-center gap-4">
            <select
              value={selectedProject[favorite.id] ?? ""}
              onChange={(event) =>
                setSelectedProject((prev) => ({
                  ...prev,
                  [favorite.id]: event.target.value,
                }))
              }
              className="by-sm border-b border-primary-00 bg-transparent py-1 outline-none"
            >
              <option value="">Agregar a proyecto...</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
              <option value="new">+ Nuevo proyecto</option>
            </select>
            <Button
              copy="Agregar"
              variant="secondary"
              disabled={isPending || !selectedProject[favorite.id]}
              onClick={() => handleAddToProject(favorite.id)}
            />
            <Button
              copy="Quitar"
              variant="secondary"
              disabled={isPending}
              onClick={() => startTransition(() => removeFavorite(favorite.id))}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FavoritosSection;
