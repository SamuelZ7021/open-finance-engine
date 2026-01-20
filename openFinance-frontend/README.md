# Open Finance Engine - Frontend

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Una aplicación web moderna de gestión financiera personal construida con React, TypeScript y Tailwind CSS. Proporciona un sistema robusto para visualizar, analizar y gestionar cuentas bancarias y transacciones.

---

## 📋 Tabla de Contenidos

- [Características Principales](#características-principales)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación y Configuración](#instalación-y-configuración)
- [Scripts Disponibles](#scripts-disponibles)
- [Arquitectura](#arquitectura)
- [Guía de Desarrollo](#guía-de-desarrollo)
- [Guía de Componentes](#guía-de-componentes)
- [Gestión del Estado](#gestión-del-estado)
- [Sistema de Alertas](#sistema-de-alertas)
- [Autenticación](#autenticación)
- [Mejores Prácticas](#mejores-prácticas)

---

## ✨ Características Principales

### 🎯 Core Features
- **Autenticación JWT** con refresh tokens en cookies httpOnly
- **Dashboard Múltiple** - 3 vistas diferentes (Principal, Rápida, Perfil)
- **Gestión de Cuentas** - Crear, ver y eliminar cuentas
- **Análisis Financiero** - Gráficos interactivos con Recharts
- **Transferencias** - Realizar transferencias entre cuentas
- **Modo Privacidad** - Ocultar montos sensibles con un solo clic
- **Sistema de Alertas** - Notificaciones personalizadas (éxito, error, advertencia, info)
- **Transacciones Globales** - Vista consolidada del ledger central

### 🎨 UX/UI
- **Tema Oscuro** - Diseño moderno con Tailwind CSS (slate-950)
- **Animaciones Suaves** - Transiciones elegantes entre vistas
- **Responsive Design** - Optimizado para desktop, tablet y mobile
- **Accesibilidad** - Componentes accesibles con WCAG compliance
- **Iconografía** - 500+ iconos de Lucide React

### ⚡ Performance
- **Vite** - Build tool ultra rápido
- **Code Splitting** - Optimización automática de chunks
- **Lazy Loading** - Carga de rutas bajo demanda
- **Memoización** - Optimización con useMemo y useCallback

---

## 🛠 Tecnologías Utilizadas

### Frontend Framework
| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| **React** | 19.2 | UI library principal |
| **TypeScript** | 5.9 | Type safety y mejor DX |
| **Vite** | 7.2 (Rolldown) | Build tool y dev server |
| **React Router** | 7.11 | Routing y navegación SPA |

### Styling & UI
| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| **Tailwind CSS** | 3.4 | Utility-first CSS framework |
| **Tailwind Merge** | 3.4 | Merge de clases Tailwind |
| **Lucide React** | 0.562 | Iconografía vectorial |

### State Management
| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| **Zustand** | 5.0.9 | State management ligero |

### Data & Visualization
| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| **Axios** | 1.13.2 | HTTP client con interceptores |
| **Recharts** | 3.6 | Gráficos y visualización de datos |
| **date-fns** | 4.1 | Utilidades para fechas |

### Utilities
| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| **clsx** | 2.1.1 | Utility para conditional classNames |

### Development Tools
| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| **ESLint** | 9.39.1 | Linting de código |
| **TypeScript ESLint** | 8.46.4 | Reglas para TypeScript |
| **PostCSS** | 8.5.6 | Procesamiento de CSS |
| **Autoprefixer** | 10.4.23 | Prefijos CSS automáticos |

---

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── api/                          # Configuración HTTP
│   │   └── axiosClient.ts           # Cliente Axios con interceptores
│   │
│   ├── components/                   # Componentes reutilizables
│   │   ├── AlertContainer.tsx       # Contenedor global de alertas
│   │   ├── ConfirmDialog.tsx        # Modal de confirmación
│   │   └── ui/
│   │       └── Alert.tsx            # Componente Alert individual
│   │
│   ├── features/                     # Componentes de features específicas
│   │   ├── dashboard/               # Dashboard feature
│   │   │   ├── AccountAnalytics.tsx # Panel de análisis de cuentas
│   │   │   ├── AccountCard.tsx      # Card individual de cuenta
│   │   │   ├── CreateAccountModal.tsx # Modal crear cuenta
│   │   │   ├── RecentTransactions.tsx # Transacciones recientes
│   │   │   └── TransferModal.tsx    # Modal de transferencias
│   │   └── form/
│   │       ├── LoginForm.tsx        # Formulario de login
│   │       └── RegisterForm.tsx     # Formulario de registro
│   │
│   ├── guards/                       # Route guards para protección
│   │   ├── ProtectedRoute.tsx       # Guard para rutas autenticadas
│   │   └── PublicRoute.tsx          # Guard para rutas públicas
│   │
│   ├── hooks/                        # Custom React hooks
│   │   └── useAlert.ts              # Hook para usar alerts
│   │
│   ├── layout/                       # Layouts principales
│   │   └── DashboardLayout.tsx      # Layout para dashboard (sidebar + header)
│   │
│   ├── pages/                        # Páginas/Vistas principales
│   │   ├── accounts/
│   │   │   └── AccountsPage.tsx     # Página de gestión de cuentas
│   │   ├── analytics/
│   │   │   └── AnalyticsPage.tsx    # Página de análisis global
│   │   └── dashboard/
│   │       ├── DashboardPage.tsx    # Dashboard principal (vista Overview)
│   │       └── DashboardProfile.tsx # Dashboard de perfil
│   │
│   ├── services/                     # Servicios de lógica de negocio
│   │   └── accountService.ts        # Servicios relacionados con cuentas
│   │
│   ├── store/                        # Zustand stores (state management)
│   │   ├── useAccountStore.ts       # State de cuentas y transacciones
│   │   ├── useAlertStore.ts         # State del sistema de alertas
│   │   ├── useAuthStore.ts          # State de autenticación
│   │   └── useUIStore.ts            # State de preferencias UI
│   │
│   ├── types/                        # TypeScript type definitions
│   │   ├── account.ts               # Tipos de cuentas
│   │   ├── AccountType.ts           # Enum de tipos de cuenta
│   │   ├── OperationType.ts         # Enum de tipos de operación
│   │   ├── Transaction.ts           # Tipos de transacciones
│   │   ├── TransactionLine.ts       # Tipos de líneas de transacción
│   │   └── User.ts                  # Tipos de usuario
│   │
│   ├── App.tsx                       # Componente raíz de la aplicación
│   ├── App.css                       # Estilos globales de App
│   ├── index.css                     # Estilos globales (Tailwind directives)
│   └── main.tsx                      # Entry point de React
│
├── public/                           # Archivos estáticos públicos
│
├── index.html                        # HTML template
├── vite.config.ts                    # Configuración de Vite
├── tsconfig.json                     # TypeScript config principal
├── tsconfig.app.json                 # TypeScript config para app
├── tsconfig.node.json                # TypeScript config para Node
├── tailwind.config.js                # Configuración de Tailwind CSS
├── postcss.config.js                 # Configuración de PostCSS
├── eslint.config.js                  # Configuración de ESLint
├── package.json                      # Dependencias y scripts
└── README.md                         # Este archivo
```

### Descripción de Directorios

#### `/api`
Contiene la configuración del cliente HTTP. El `axiosClient.ts` gestiona:
- Interceptores de request/response
- Manejo automático de tokens JWT
- Refresh de tokens con cookies httpOnly
- Headers customizados

#### `/components`
Componentes reutilizables y genéricos:
- **Alert**: Sistema de notificaciones toast personalizado
- **ConfirmDialog**: Modal para acciones destructivas
- Componentes UI atómicos

#### `/features`
Componentes acoplados a features específicas:
- Dashboards y sus subcomponentes
- Formularios de autenticación
- Modales de operaciones (crear cuenta, transferencias)

#### `/guards`
Componentes wrapper para proteger rutas:
- `ProtectedRoute`: Solo usuarios autenticados
- `PublicRoute`: Solo usuarios no autenticados

#### `/layout`
Layouts principales que envuelven páginas:
- `DashboardLayout`: Proporciona sidebar, header y selector de modo dashboard

#### `/pages`
Componentes de página raíz - una por cada ruta principal

#### `/store`
Stores de Zustand para gestión global de estado:
- Autenticación, cuentas, alertas, preferencias UI

#### `/types`
Definiciones TypeScript centralizadas para máxima type safety

---

## 🚀 Instalación y Configuración

### Requisitos Previos
- **Node.js**: v18+ recomendado
- **npm**: v9+
- **Backend**: API debe estar ejecutándose en `http://localhost:8080`

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <repo-url>
cd frontend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno** (si aplica)
```bash
# Crear archivo .env.local
VITE_API_URL=http://localhost:8080
```

4. **Verificar la compilación**
```bash
npm run build
```

---

## 📝 Scripts Disponibles

```bash
# Desarrollo - inicia servidor con HMR en http://localhost:5173
npm run dev

# Build - compila TypeScript y genera bundle optimizado
npm run build

# Linting - ejecuta ESLint en todo el código
npm run lint

# Preview - sirve el build para testing local
npm run preview
```

### Ejemplo de Workflow
```bash
npm run dev          # Desarrollo local
npm run lint         # Verificar código antes de commit
npm run build        # Build para producción
npm run preview      # Verificar build localmente
```

---

## 🏗 Arquitectura

### Patrones de Arquitectura

#### 1. **Separación por Capas**
```
UI (Pages/Components)
    ↓
State Management (Zustand Stores)
    ↓
Services (Lógica de negocio)
    ↓
API (Axios Client)
```

#### 2. **Component Hierarchy**
```
App (Router + AlertContainer)
├── AuthPage (Public)
│   ├── LoginForm
│   └── RegisterForm
└── DashboardLayout (Protected)
    ├── Sidebar
    ├── Header
    └── Page
        ├── DashboardPage (Principal)
        ├── QuickDashboard (Rápida)
        ├── DashboardProfile (Perfil)
        ├── AccountsPage
        └── AnalyticsPage
```

#### 3. **Data Flow**
```
Component
    ↓
useStore (Zustand)
    ↓
Service Layer
    ↓
Axios (HTTP Request)
    ↓
Backend API
```

### State Management Architecture

```typescript
// Patrón de Zustand utilizado
const useStore = create<StoreState>((set, get) => ({
  // Estado inicial
  property: initialValue,
  
  // Métodos/Actions
  method: async (args) => {
    set({ loading: true });
    try {
      const data = await api.call();
      set({ property: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  }
}));
```

---

## 💻 Guía de Desarrollo

### Convenciones de Código

#### Naming Conventions
```typescript
// Components - PascalCase
export function MyComponent() {}
export const MyComponent = () => {}

// Functions/Methods - camelCase
const handleClick = () => {}
const fetchData = async () => {}

// Constants - UPPER_SNAKE_CASE
const MAX_RETRIES = 3;
const API_TIMEOUT = 5000;

// Types - PascalCase
interface User {}
type UserRole = 'admin' | 'user';
```

#### File Organization
```
FeatureName/
├── FeatureName.tsx        # Componente principal
├── FeatureName.css        # Estilos específicos (si aplica)
├── FeatureName.types.ts   # Tipos locales (si aplica)
└── hooks/                 # Custom hooks (si aplica)
    └── useFeature.ts
```

### Crear un Nuevo Componente

#### Estructura Recomendada
```typescript
// src/components/MyComponent.tsx
import { FC } from 'react';

interface MyComponentProps {
  title: string;
  onClick: () => void;
}

export const MyComponent: FC<MyComponentProps> = ({ 
  title, 
  onClick 
}) => {
  return (
    <div>
      <h1>{title}</h1>
      <button onClick={onClick}>Click me</button>
    </div>
  );
};

export default MyComponent;
```

### Crear un Custom Hook

```typescript
// src/hooks/useMyHook.ts
import { useState, useCallback } from 'react';

export const useMyHook = (initialValue: string) => {
  const [value, setValue] = useState(initialValue);

  const update = useCallback((newValue: string) => {
    setValue(newValue);
  }, []);

  return { value, update };
};
```

### Crear un Zustand Store

```typescript
// src/store/useMyStore.ts
import { create } from 'zustand';

interface MyState {
  count: number;
  increment: () => void;
  decrement: () => void;
}

export const useMyStore = create<MyState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));
```

---

## 🧩 Guía de Componentes

### Componentes Principales

#### Alert System
```typescript
// Uso simple
import { useAlert } from '@/hooks/useAlert';

export function MyComponent() {
  const { success, error, warning, info } = useAlert();

  const handleSuccess = () => {
    success('Success', 'Operation completed!');
  };

  const handleError = () => {
    error('Error', 'Something went wrong');
  };

  return (
    <div>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>
    </div>
  );
}

// El AlertContainer se renderiza automáticamente en App.tsx
```

**Tipos de Alert:**
- `success(title, message)` - Verde, para acciones exitosas
- `error(title, message)` - Rojo, para errores
- `warning(title, message)` - Amarillo, para advertencias
- `info(title, message)` - Azul, para información

#### ConfirmDialog
```typescript
import { useState } from 'react';
import { ConfirmDialog } from '@/components/ConfirmDialog';

export function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      // Operación destructiva
      await deleteAccount();
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Delete</button>
      <ConfirmDialog
        title="Delete Account?"
        description="This action cannot be undone"
        isDestructive
        isOpen={isOpen}
        isLoading={isLoading}
        onConfirm={handleConfirm}
        onCancel={() => setIsOpen(false)}
      />
    </>
  );
}
```

#### Dashboard Layout
Usado automáticamente por todas las páginas autenticadas en el wrapper `DashboardLayout`.

```typescript
// src/pages/MyPage.tsx
import { useEffect } from 'react';
import { DashboardLayout } from '@/layout/DashboardLayout';

export function MyPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Tu contenido aquí */}
      </div>
    </DashboardLayout>
  );
}
```

---

## 🔐 Gestión del Estado

### useAuthStore
Gestiona toda la lógica de autenticación.

```typescript
import { useAuthStore } from '@/store/useAuthStore';

export function LoginComponent() {
  const login = useAuthStore(state => state.login);
  const isLoading = useAuthStore(state => state.isLoading);
  const error = useAuthStore(state => state.error);

  const handleLogin = async (email: string, password: string) => {
    await login({ email, password });
  };

  return (
    // Renderizar basado en estado
  );
}
```

**Métodos:**
- `login(credentials)` - Autentica usuario
- `register(email, password)` - Registra nuevo usuario
- `logout()` - Cierra sesión
- `checkAuth()` - Verifica sesión activa (refresh token)

**Estado:**
- `accessToken: string | null` - Token JWT actual
- `isAuthenticated: boolean` - Si hay sesión activa
- `isLoading: boolean` - Loading durante operaciones
- `error: string | null` - Mensaje de error si aplica

### useAccountStore
Gestiona cuentas, transferencias y transacciones.

```typescript
import { useAccountStore } from '@/store/useAccountStore';

export function AccountsComponent() {
  const accounts = useAccountStore(state => state.accounts);
  const createAccount = useAccountStore(state => state.createAccount);
  
  return (
    <div>
      {accounts.map(acc => (
        <div key={acc.id}>{acc.name}</div>
      ))}
    </div>
  );
}
```

### useUIStore
Preferencias de interfaz de usuario.

```typescript
const privacyMode = useUIStore(state => state.privacyMode);
const togglePrivacy = useUIStore(state => state.togglePrivacy);
```

### useAlertStore
Gestión interna de alertas (generalmente no se usa directamente, usar `useAlert()` hook en su lugar).

---

## 🔔 Sistema de Alertas

### Arquitectura

```
Component
  ↓
useAlert Hook (conveniencia)
  ↓
useAlertStore (Zustand)
  ↓
AlertContainer (renderiza)
  ↓
Alert Component (visual)
```

### Características
- ✅ Auto-close después de 5 segundos
- ✅ Dismiss manual con botón X
- ✅ Stack múltiple de alertas
- ✅ Animación slide-down suave
- ✅ Posición top-right fixed
- ✅ Z-index 50 (sobre modal)

### Tipos y Colores
| Tipo | Color | Icono | Uso |
|------|-------|-------|-----|
| `success` | Verde | CheckCircle | Operaciones exitosas |
| `error` | Rojo | AlertCircle | Errores |
| `warning` | Amarillo | AlertTriangle | Advertencias |
| `info` | Azul | Info | Información general |

---

## 🔑 Autenticación

### Flujo de Autenticación

```
1. Usuario ingresa credenciales en LoginForm
   ↓
2. LoginForm llama a useAuthStore.login()
   ↓
3. Axios POST a /api/v1/auth/login
   ↓
4. Backend retorna accessToken + Set-Cookie: refresh_token
   ↓
5. Store actualiza isAuthenticated = true
   ↓
6. ProtectedRoute permite acceso
   ↓
7. Router navega a /dashboard
```

### Refresh Token Strategy
```
- accessToken: JWT en memoria (corta duración)
- refreshToken: httpOnly cookie (larga duración)

Si accessToken expira:
  1. Axios interceptor detecta 401
  2. POST /api/v1/auth/refresh con refreshToken
  3. Backend valida y retorna nuevo accessToken
  4. Retry automático de request original
```

### Protected Routes
```typescript
// src/guards/ProtectedRoute.tsx
export function ProtectedRoute() {
  const isInitializing = useAuthStore(state => state.isInitializing);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  if (isInitializing) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/" />;
  
  return <Outlet />;
}
```

---

## ✅ Mejores Prácticas

### 1. Type Safety
```typescript
// ✅ BIEN
interface Account {
  id: string;
  name: string;
  balance: number;
}

const account: Account = { id: '1', name: 'Savings', balance: 1000 };

// ❌ MAL
const account: any = { id: '1', name: 'Savings', balance: 1000 };
```

### 2. Error Handling
```typescript
// ✅ BIEN
try {
  const data = await api.get('/accounts');
  set({ accounts: data, error: null });
} catch (error: any) {
  const message = error.response?.data?.message || 'Unknown error';
  set({ error: message });
  throw error;
}

// ❌ MAL
const data = await api.get('/accounts');
set({ accounts: data });
```

### 3. Component Composition
```typescript
// ✅ BIEN - Componentes pequeños y reutilizables
export function AccountCard() { /* ... */ }
export function AccountList() {
  return accounts.map(acc => <AccountCard key={acc.id} {...acc} />);
}

// ❌ MAL - Todo en un componente
export function Accounts() {
  return (
    <div>
      {/* 500 líneas de código */}
    </div>
  );
}
```

### 4. Memoization
```typescript
// ✅ BIEN - Evita re-renders innecesarios
const totalBalance = useMemo(
  () => accounts.reduce((sum, acc) => sum + acc.balance, 0),
  [accounts]
);

// ❌ MAL - Recalcula en cada render
const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
```

### 5. State Management
```typescript
// ✅ BIEN - Selecciona solo lo que necesita
const accounts = useAccountStore(state => state.accounts);

// ❌ MAL - Subscripción a todo el store
const state = useAccountStore();
const accounts = state.accounts;
```

### 6. Eventos Asíncronos
```typescript
// ✅ BIEN - Loading state durante operación
const handleDelete = async () => {
  setIsLoading(true);
  try {
    await deleteAccount();
    success('Deleted!');
  } catch (error) {
    error('Failed to delete');
  } finally {
    setIsLoading(false);
  }
};

// ❌ MAL - Sin feedback al usuario
const handleDelete = async () => {
  await deleteAccount();
};
```

### 7. Conditional Rendering
```typescript
// ✅ BIEN
{isLoading && <Spinner />}
{!isLoading && data && <Content data={data} />}
{!isLoading && error && <Error error={error} />}

// ❌ MAL
{isLoading ? <Spinner /> : <Content />}
```

### 8. Naming Clarity
```typescript
// ✅ BIEN - Nombres descriptivos
const handleAccountCreation = async () => {};
const isDeleteConfirmed = true;

// ❌ MAL - Nombres ambiguos
const handle = async () => {};
const isDelete = true;
```

---

## 📊 Animaciones CSS

### Keyframes Disponibles

```css
/* fade-in: Transición de opacidad (0.5s ease-out) */
@keyframes fade-in {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}

/* slide-down: Transición vertical (0.3s ease-out) */
@keyframes slide-down {
  0% { 
    opacity: 0;
    transform: translateY(-0.5rem);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-slide-down {
  animation: slide-down 0.3s ease-out;
}
```

### Uso en Componentes
```typescript
// Page entrance animation
<div className="animate-fade-in">
  <h1>Welcome</h1>
</div>

// Alert entrance animation
<div className="animate-slide-down">
  <Alert />
</div>

// Staggered animations
<div className="animate-fade-in" style={{ animationDelay: '0s' }}>
<div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
```

---

## 🔗 Recursos Útiles

### Documentación
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [React Router v7](https://reactrouter.com)
- [Zustand Guide](https://zustand.js.org)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Recharts](https://recharts.org)
- [Axios](https://axios-http.com)

### Herramientas Recomendadas
- [React Developer Tools](https://react-devtools-tutorial.vercel.app) - Browser extension
- [Redux DevTools](https://github.com/reduxjs/redux-devtools) - State debugging
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) - VS Code extension
- [TypeScript Vue Plugin](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) - VS Code extension

---

## 🐛 Troubleshooting

### Problema: CORS Error en desarrollo
**Solución:** Verificar que el backend está permitiendo requests desde `http://localhost:5173`

### Problema: Token expirado al hacer reload
**Solución:** El `checkAuth()` en `App.tsx` debería refrescar automáticamente. Verificar que las cookies están habilitadas.

### Problema: Cambios no se reflejan en componente
**Solución:** Verificar que el selector de Zustand es correcto y que el estado se actualiza correctamente en el store.

### Problema: Build size muy grande
**Solución:** Ejecutar `npm run build` y revisar `dist/` para identificar chunks grandes. Considerar code splitting.

---

## 📈 Performance Optimization

### Actualización Sugerida
```typescript
// Usar Suspense para lazy loading
const Dashboard = lazy(() => import('./pages/dashboard/DashboardPage'));

// En rutas
<Suspense fallback={<Loading />}>
  <Dashboard />
</Suspense>
```

### Monitoreo
```bash
# Analizar tamaño del bundle
npm run build -- --analyze

# Profiling en desarrollo
# Usar React DevTools Profiler tab
```

---

## 📝 Notas de Desarrollo

### Commits Recomendados
```
feat: Agregar nuevo componente X
fix: Corregir bug en autenticación
refactor: Mejorar performance de AccountList
style: Formatear código según ESLint
```

### Pre-commit Checklist
- [ ] `npm run lint` sin errores
- [ ] `npm run build` sin errores
- [ ] Tests locales passing
- [ ] TypeScript strict mode sin warnings

---

## 👨‍💻 Autor

**Samuel Zapata**  
Full-Stack Developer | Open Finance Engine  
[GitHub](https://github.com/SamuelZ7021)

---
### Core Backend Engineer
- Repositorio: [Backend](https://github.com/SamuelZ7021/backend)
