"use client";

// ================================================================
//  AXO — Auth & RBAC Context
//  Gestión de Permisos, Autenticación y Onboarding de Comercios/Repartidores
//  (Preparado para integración directa con Supabase Auth)
// ================================================================

import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "buyer" | "seller" | "driver";
export type AccountStatus = "guest" | "pending_approval" | "approved";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: AccountStatus;
  businessName?: string;
  zone?: string;
  avatar?: string;
}

export interface SellerApplication {
  id: string;
  businessName: string;
  category: string;
  cuit?: string;
  address: string;
  zone: string;
  whatsapp: string;
  managerName: string;
  schedule: string;
  submittedAt: string;
  status: "pending" | "approved";
}

export interface DriverApplication {
  id: string;
  fullName: string;
  dni: string;
  phone: string;
  vehicle: "moto" | "auto" | "bici";
  hasThermalBag: boolean;
  preferredZone: string;
  availability: string;
  submittedAt: string;
  status: "pending" | "approved";
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isSellerApproved: boolean;
  isDriverApproved: boolean;
  // Modales
  sellerModalOpen: boolean;
  driverModalOpen: boolean;
  loginModalOpen: boolean;
  setSellerModalOpen: (open: boolean) => void;
  setDriverModalOpen: (open: boolean) => void;
  setLoginModalOpen: (open: boolean) => void;
  // Acciones Onboarding
  submitSellerApplication: (data: Omit<SellerApplication, "id" | "submittedAt" | "status">) => Promise<boolean>;
  submitDriverApplication: (data: Omit<DriverApplication, "id" | "submittedAt" | "status">) => Promise<boolean>;
  // Acciones Auth
  quickLogin: (role: UserRole) => void;
  logout: () => void;
  // Historial de solicitudes en sesión
  sellerApplications: SellerApplication[];
  driverApplications: DriverApplication[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [sellerModalOpen, setSellerModalOpen] = useState(false);
  const [driverModalOpen, setDriverModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const [sellerApplications, setSellerApplications] = useState<SellerApplication[]>([]);
  const [driverApplications, setDriverApplications] = useState<DriverApplication[]>([]);

  // Estado inicial: Comprador invitado (Fricción cero)
  useEffect(() => {
    const saved = localStorage.getItem("axo_auth_user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const saveUser = (u: AuthUser | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem("axo_auth_user", JSON.stringify(u));
    } else {
      localStorage.removeItem("axo_auth_user");
    }
  };

  // Simulación de envío de solicitud de comercio
  const submitSellerApplication = async (
    data: Omit<SellerApplication, "id" | "submittedAt" | "status">
  ): Promise<boolean> => {
    // Simula latencia de red
    await new Promise((r) => setTimeout(r, 800));

    const newApp: SellerApplication = {
      ...data,
      id: `app-seller-${Date.now()}`,
      submittedAt: new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
      status: "pending",
    };

    setSellerApplications((prev) => [newApp, ...prev]);

    // Establecemos usuario en estado pendiente
    saveUser({
      id: newApp.id,
      name: data.managerName,
      email: `${data.businessName.toLowerCase().replace(/\s+/g, "")}@axo.local`,
      phone: data.whatsapp,
      role: "seller",
      status: "pending_approval",
      businessName: data.businessName,
      zone: data.zone,
    });

    return true;
  };

  // Simulación de envío de solicitud de repartidor
  const submitDriverApplication = async (
    data: Omit<DriverApplication, "id" | "submittedAt" | "status">
  ): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 800));

    const newApp: DriverApplication = {
      ...data,
      id: `app-driver-${Date.now()}`,
      submittedAt: new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
      status: "pending",
    };

    setDriverApplications((prev) => [newApp, ...prev]);

    saveUser({
      id: newApp.id,
      name: data.fullName,
      email: `${data.fullName.toLowerCase().replace(/\s+/g, "")}@cadetes.axo.local`,
      phone: data.phone,
      role: "driver",
      status: "pending_approval",
      zone: data.preferredZone,
    });

    return true;
  };

  // Login rápido preconfigurado para pruebas de inversores y socios
  const quickLogin = (role: UserRole) => {
    if (role === "seller") {
      saveUser({
        id: "usr-seller-01",
        name: "Carlos Méndez (Encargado)",
        email: "ventas@delidrinks.posadas",
        phone: "+54 376 4129988",
        role: "seller",
        status: "approved",
        businessName: "Deli Drinks Posadas",
        zone: "Centro",
      });
    } else if (role === "driver") {
      saveUser({
        id: "usr-driver-08",
        name: "Rodrigo G. (Móvil #08)",
        email: "rodrigo.motos@axo.local",
        phone: "+54 376 4781122",
        role: "driver",
        status: "approved",
        zone: "Centro / Villa Sarita",
      });
    } else {
      saveUser(null);
    }
    setLoginModalOpen(false);
  };

  const logout = () => {
    saveUser(null);
  };

  const isAuthenticated = user !== null && user.status === "approved";
  const isSellerApproved = user?.role === "seller" && user.status === "approved";
  const isDriverApproved = user?.role === "driver" && user.status === "approved";

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isSellerApproved,
        isDriverApproved,
        sellerModalOpen,
        driverModalOpen,
        loginModalOpen,
        setSellerModalOpen,
        setDriverModalOpen,
        setLoginModalOpen,
        submitSellerApplication,
        submitDriverApplication,
        quickLogin,
        logout,
        sellerApplications,
        driverApplications,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser utilizado dentro de un AuthProvider");
  }
  return context;
}
