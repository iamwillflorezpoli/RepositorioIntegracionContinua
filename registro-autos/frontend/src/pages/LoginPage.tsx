import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { z } from "zod";

import { getApiErrorMessage } from "../api/apiErrorHandler";
import { useAuth } from "../auth/AuthContext";

const loginSchema = z.object({
  email: z.string().email("Ingresa un correo válido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  if (isAuthenticated) {
    return <Navigate to="/cars" replace />;
  }

  async function onSubmit(values: LoginFormValues): Promise<void> {
    try {
      setErrorMessage(null);
      await login(values);
      navigate("/cars");
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>Iniciar sesión</h1>
        <p>Accede para gestionar tus autos registrados.</p>

        {errorMessage && <div className="alert alert-error">{errorMessage}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="form">
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
            {isSubmitting ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p className="auth-link">
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </p>
      </section>
    </main>
  );
}