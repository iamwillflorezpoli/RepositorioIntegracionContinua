import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { CarRequest, CarResponse } from "../models/car";

const currentYear = new Date().getFullYear();

const carSchema = z.object({
  brand: z.string().min(2, "La marca debe tener mínimo 2 caracteres"),
  model: z.string().min(2, "El modelo debe tener mínimo 2 caracteres"),
  year: z
    .number({
      message: "El año es obligatorio",
    })
    .int("El año debe ser un número entero")
    .min(1900, "El año no puede ser menor a 1900")
    .max(currentYear, `El año no puede ser mayor a ${currentYear}`),
  plateNumber: z
    .string()
    .min(3, "La placa debe tener mínimo 3 caracteres")
    .max(20, "La placa no puede superar 20 caracteres")
    .regex(
      /^[A-Za-z0-9-]+$/,
      "La placa solo puede contener letras, números o guiones"
    ),
  color: z.string().min(2, "El color debe tener mínimo 2 caracteres"),
});

type CarFormValues = z.infer<typeof carSchema>;

interface CarFormProps {
  initialValues?: CarResponse | null;
  submitLabel: string;
  isSubmitting?: boolean;
  onSubmit: (request: CarRequest) => Promise<void>;
  onCancel: () => void;
}

const emptyValues: CarFormValues = {
  brand: "",
  model: "",
  year: currentYear,
  plateNumber: "",
  color: "",
};

export function CarForm({
  initialValues,
  submitLabel,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: CarFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CarFormValues>({
    resolver: zodResolver(carSchema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (initialValues) {
      reset({
        brand: initialValues.brand,
        model: initialValues.model,
        year: initialValues.year,
        plateNumber: initialValues.plateNumber,
        color: initialValues.color,
      });
      return;
    }

    reset(emptyValues);
  }, [initialValues, reset]);

  async function onFormSubmit(values: CarFormValues): Promise<void> {
    await onSubmit({
      brand: values.brand.trim(),
      model: values.model.trim(),
      year: values.year,
      plateNumber: values.plateNumber.trim().toUpperCase(),
      color: values.color.trim(),
    });
  }

  return (
    <form className="car-form" onSubmit={handleSubmit(onFormSubmit)}>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="brand">Marca</label>
          <input id="brand" type="text" {...register("brand")} />
          {errors.brand && <span>{errors.brand.message}</span>}
        </div>

        <div className="field">
          <label htmlFor="model">Modelo</label>
          <input id="model" type="text" {...register("model")} />
          {errors.model && <span>{errors.model.message}</span>}
        </div>

        <div className="field">
          <label htmlFor="year">Año</label>
          <input
            id="year"
            type="number"
            {...register("year", { valueAsNumber: true })}
          />
          {errors.year && <span>{errors.year.message}</span>}
        </div>

        <div className="field">
          <label htmlFor="plateNumber">Placa</label>
          <input id="plateNumber" type="text" {...register("plateNumber")} />
          {errors.plateNumber && <span>{errors.plateNumber.message}</span>}
        </div>

        <div className="field">
          <label htmlFor="color">Color</label>
          <input id="color" type="text" {...register("color")} />
          {errors.color && <span>{errors.color.message}</span>}
        </div>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </button>

        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : submitLabel}
        </button>
      </div>
    </form>
  );
}