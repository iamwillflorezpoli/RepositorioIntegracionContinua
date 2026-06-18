import { Pencil, Trash2 } from "lucide-react";

import type { CarResponse } from "../models/car";

interface CarTableProps {
  cars: CarResponse[];
  onEdit: (car: CarResponse) => void;
  onDelete: (car: CarResponse) => void;
}

export function CarTable({ cars, onEdit, onDelete }: CarTableProps) {
  return (
    <div className="table-wrapper">
      <table className="cars-table">
        <thead>
          <tr>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Año</th>
            <th>Placa</th>
            <th>Color</th>
            <th className="actions-column">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {cars.map((car) => (
            <tr key={car.id}>
              <td>{car.brand}</td>
              <td>{car.model}</td>
              <td>{car.year}</td>
              <td>
                <span className="plate-badge">{car.plateNumber}</span>
              </td>
              <td>{car.color}</td>
              <td>
                <div className="row-actions">
                  <button
                    type="button"
                    className="btn btn-icon btn-icon-primary"
                    aria-label={`Editar auto ${car.plateNumber}`}
                    onClick={() => onEdit(car)}
                  >
                    <Pencil size={18} strokeWidth={2.3} aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    className="btn btn-icon btn-icon-danger"
                    aria-label={`Eliminar auto ${car.plateNumber}`}
                    onClick={() => onDelete(car)}
                  >
                    <Trash2 size={18} strokeWidth={2.3} aria-hidden="true" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}