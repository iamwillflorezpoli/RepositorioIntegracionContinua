import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { z } from "zod";

import { getApiErrorMessage } from "../api/apiErrorHandler";
import { useAuth } from "../auth/AuthContext";

const registerSchema = z.object({
  name: z.string().min(2, "El nombre debe tener mínimo 2 caracteres"),
  email: z.string().email("Ingresa un correo válido"),
  password: z.string().min(6, "La contraseña debe tener mínimo 6 caracteres"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerAccount, isAuthenticated } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  if (isAuthenticated) {
    return <Navigate to="/cars" replace />;
  }

  async function onSubmit(values: RegisterFormValues): Promise<void> {
    try {
      setErrorMessage(null);
      await registerAccount(values);
      navigate("/cars");
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>Crear cuenta</h1>
        <p>Regístrate para empezar a gestionar tus autos.</p>

        {errorMessage && <div className="alert alert-error">{errorMessage}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="field">
            <label htmlFor="name">Nombre</label>
            <input id="name" type="text" {...register("name")} />
            {errors.name && <span>{errors.name.message}</span>}
          </div>

          <div className="field">
            <label htmlFor="email">Correo</label>
            <input id="email" type="email" {...register("email")} />
            {errors.email && <span>{errors.email.message}</span>}
          </div>

          <div className="field">
            <label htmlFor="password">Contraseña</label>
            <input id="password" type="password" {...register("password")} />
            {errors.password && <span>{errors.password.message}</span>}
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
            {isSubmitting ? "Registrando..." : "Registrarme"}
          </button>
        </form>

        <p className="auth-link">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </section>
    </main>
  );
}