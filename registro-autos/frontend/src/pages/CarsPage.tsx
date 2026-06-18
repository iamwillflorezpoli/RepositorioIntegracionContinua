import { useEffect, useState } from "react";

import {
  createCar,
  deleteCar,
  getMyCars,
  updateCar,
} from "../api/carApi";
import { getApiErrorMessage } from "../api/apiErrorHandler";
import { Car, Plus, Power } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { CarForm } from "../components/CarForm";
import { CarTable } from "../components/CarTable";
import { ConfirmDialog } from "../components/ConfirmDialog";
import type { CarRequest, CarResponse } from "../models/car";


export function CarsPage() {
  const { user, logout } = useAuth();

  const [cars, setCars] = useState<CarResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<CarResponse | null>(null);
  const [carToDelete, setCarToDelete] = useState<CarResponse | null>(null);

  useEffect(() => {
    void loadCars();
  }, []);

  async function loadCars(): Promise<void> {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const response = await getMyCars();
      setCars(response);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  function openCreateForm(): void {
    setSelectedCar(null);
    setFormErrorMessage(null);
    setIsFormOpen(true);
  }

  function openEditForm(car: CarResponse): void {
    setSelectedCar(car);
    setFormErrorMessage(null);
    setIsFormOpen(true);
  }

  function closeForm(): void {
    setSelectedCar(null);
    setFormErrorMessage(null);
    setIsFormOpen(false);
  }

  async function handleSaveCar(request: CarRequest): Promise<void> {
    try {
      setIsSaving(true);
      setFormErrorMessage(null);

      if (selectedCar) {
        await updateCar(selectedCar.id, request);
      } else {
        await createCar(request);
      }

      closeForm();
      await loadCars();
    } catch (error) {
      setFormErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  function requestDeleteCar(car: CarResponse): void {
    setCarToDelete(car);
  }

  function cancelDelete(): void {
    setCarToDelete(null);
  }

  async function confirmDeleteCar(): Promise<void> {
    if (!carToDelete) {
      return;
    }

    try {
      setIsDeleting(true);
      setErrorMessage(null);

      await deleteCar(carToDelete.id);

      setCars((currentCars) =>
        currentCars.filter((car) => car.id !== carToDelete.id)
      );
      setCarToDelete(null);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <main className="page">
      <section className="panel">
        <header className="cars-header">
          <div>
            <h1>Mis autos</h1>
            <p>Bienvenido, {user?.name}. Gestiona tus autos registrados.</p>
          </div>

          <button
            type="button"
            className="btn btn-icon btn-icon-muted tooltip"
            data-tooltip="Cerrar sesión"
            aria-label="Cerrar sesión"
            onClick={logout}
          >
            <Power size={20} strokeWidth={2.4} aria-hidden="true" />
          </button>
        </header>

        <section className="cars-toolbar">
          <div>
            <h2>Autos registrados</h2>
            <p>Consulta, agrega o actualiza los autos asociados a tu cuenta.</p>
          </div>

          <button
            type="button"
            className="btn btn-icon btn-icon-primary tooltip"
            data-tooltip="Agregar auto"
            aria-label="Agregar auto"
            onClick={openCreateForm}
          >
            <span className="button-icon-stack" aria-hidden="true">
              <Car size={22} strokeWidth={2.2} />
              <Plus size={13} strokeWidth={2.8} className="button-icon-badge" />
            </span>
          </button>
        </section>

        {errorMessage && (
          <div className="alert alert-error">{errorMessage}</div>
        )}

        {isFormOpen && (
          <section className="form-section">
            <h2>{selectedCar ? "Editar auto" : "Agregar auto"}</h2>

            {formErrorMessage && (
              <div className="alert alert-error">{formErrorMessage}</div>
            )}

            <CarForm
              initialValues={selectedCar}
              submitLabel={selectedCar ? "Guardar cambios" : "Crear auto"}
              isSubmitting={isSaving}
              onSubmit={handleSaveCar}
              onCancel={closeForm}
            />
          </section>
        )}

        <section className="cars-section">
          {isLoading ? (
            <p className="state-message">Cargando autos...</p>
          ) : cars.length === 0 ? (
            <div className="empty-state">
              <h2>No tienes autos registrados</h2>
              <p>Agrega tu primer auto para verlo listado en esta pantalla.</p>
              <button type="button" className="btn btn-primary" onClick={openCreateForm}>
                Agregar auto
              </button>
            </div>
          ) : (
            <CarTable
              cars={cars}
              onEdit={openEditForm}
              onDelete={requestDeleteCar}
            />
          )}
        </section>
      </section>

      <ConfirmDialog
        open={Boolean(carToDelete)}
        title="Eliminar auto"
        message={
          carToDelete
            ? `¿Seguro que deseas eliminar el auto con placa ${carToDelete.plateNumber}?`
            : ""
        }
        confirmLabel="Eliminar"
        isLoading={isDeleting}
        onConfirm={() => void confirmDeleteCar()}
        onCancel={cancelDelete}
      />
    </main>
  );
}