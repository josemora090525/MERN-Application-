# Frontend - Interfaz de Usuario

Este documento explica en detalle el funcionamiento del frontend desarrollado con React.

---

## 1. Tecnologias del Frontend

### React

React es una biblioteca de JavaScript para construir interfaces de usuario. Sus conceptos fundamentales son:

- **Componentes**: Piezas reutilizables de interfaz (como bloques de LEGO)
- **Props**: Datos que un componente padre pasa a un componente hijo
- **Estado (State)**: Datos que un componente maneja internamente y pueden cambiar
- **Hooks**: Funciones especiales para usar caracteristicas de React

### Vite

Vite es una herramienta de desarrollo que ofrece:
- Inicio rapido del servidor de desarrollo
- Recarga en caliente (Hot Module Replacement)
- Compilacion optimizada para produccion

### Tailwind CSS

Tailwind es un framework de CSS utilitario. En lugar de escribir CSS tradicional, se usan clases predefinidas:

```jsx
// CSS tradicional
<div className="card">...</div>
// .card { background: white; padding: 16px; border-radius: 8px; }

// Tailwind CSS
<div className="bg-white p-4 rounded-lg">...</div>
```

### Zustand

Zustand es una biblioteca de gestion de estado. Permite compartir datos entre componentes sin necesidad de pasarlos manualmente a traves de props.

---

## 2. Punto de Entrada (main.jsx)

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);
```

### Explicacion:

- **ReactDOM.createRoot()**: Crea la raiz de la aplicacion React
- **BrowserRouter**: Envuelve la aplicacion para habilitar el enrutamiento
- **App**: Componente principal de la aplicacion

---

## 3. Componente Principal (App.jsx)

```jsx
import { Route, Routes, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import CategoryPage from "./pages/CategoryPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import PurchaseSuccessPage from "./pages/PurchaseSuccesPage.jsx";
import PurchaseCancelPage from "./pages/PurchaseCancelPage.jsx";

import Navbar from "./components/Navbar.jsx";
import { Toaster } from "react-hot-toast";
import { useUserStore } from "./stores/useUserStore.js";
import { useCartStore } from "./stores/useCartStore.js";
import { useEffect } from "react";
import LoadingSpinner from "./components/LoadingSpinner.jsx";

function App() {
    const {user, checkAuth, checkingAuth} = useUserStore();
    const {getCartItems} = useCartStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        if(!user) return;
        getCartItems();
    }, [getCartItems, user]);

    if(checkingAuth) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
            {/* Background gradient */}
            <div className='absolute inset-0 overflow-hidden pointer-events-none'>
                <div className='absolute inset-0'>
                    <div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full 
                         bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,
                         rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]' />
                </div>
            </div>

            <Navbar />
            
            <div className='relative z-10 pt-20'>
                <Routes>
                    <Route path='/' element={<HomePage />} />
                    <Route path='/signup' element={!user ? <SignUpPage /> : <Navigate to='/' />} />
                    <Route path='/login' element={!user ? <LoginPage /> : <Navigate to='/' />} />
                    <Route path='/secret-dashboard' 
                           element={user?.role === "admin" ? <AdminPage /> : <Navigate to='/login' />} />
                    <Route path="/category/:category" element={<CategoryPage />} />
                    <Route path='/cart' element={user ? <CartPage /> : <Navigate to='/login' />} />
                    <Route path='/purchase-success' 
                           element={user ? <PurchaseSuccessPage /> : <Navigate to='/login' />} />
                    <Route path='/purchase-cancel' 
                           element={user ? <PurchaseCancelPage /> : <Navigate to='/login' />} />
                </Routes>
            </div>
            <Toaster />
        </div>
    );
}

export default App;
```

### Explicacion:

#### Hooks de Efecto (useEffect):

```jsx
useEffect(() => {
    checkAuth();
}, [checkAuth]);
```

- `useEffect` ejecuta codigo cuando el componente se monta o cuando cambian las dependencias
- El array `[checkAuth]` indica que el efecto se ejecuta cuando `checkAuth` cambia
- En este caso, verifica la autenticacion cuando la aplicacion carga

#### Rutas Protegidas:

```jsx
<Route path='/cart' element={user ? <CartPage /> : <Navigate to='/login' />} />
```

- Si `user` existe, muestra la pagina del carrito
- Si no, redirige a la pagina de login

#### Rutas de Admin:

```jsx
<Route path='/secret-dashboard' 
       element={user?.role === "admin" ? <AdminPage /> : <Navigate to='/login' />} />
```

- Solo permite acceso si el usuario tiene rol "admin"
- `user?.role` usa optional chaining para evitar errores si user es null

---

## 4. Gestion de Estado con Zustand

### Store de Usuario (useUserStore.js)

```jsx
import {create} from 'zustand';
import axios from '../lib/axios.js';
import {toast} from 'react-hot-toast';

export const useUserStore = create((set, get) => ({
    user: null,
    loading: false,
    checkingAuth: true,

    signup: async ({name, email, password, confirmPassword}) => {
        set({loading: true});

        if(password !== confirmPassword) {
            set({loading: false});
            return toast.error("Passwords do not match");
        }

        try {
            const res = await axios.post('/auth/signup', {name, email, password});
            set({user: res.data.user, loading: false});
            toast.success("Signup successful");
        } catch(error) {
            set({loading: false});
            toast.error(error.response?.data?.message || "An error occurred");
        }
    },

    login: async ({email, password}) => {
        set({ loading: true });

        try {
            const res = await axios.post("/auth/login", { email, password });
            set({ user: res.data, loading: false });
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "An error occurred");
        }
    },

    checkAuth: async () => {
        set({checkingAuth: true});
        try {
            const response = await axios.get('/auth/profile');
            set({user: response.data, checkingAuth: false});
        } catch(error) {
            console.log(error.message);
            set({checkingAuth: false, user: null});
        }
    },

    refreshToken: async () => {
        if (get().checkingAuth) return;

        set({ checkingAuth: true });
        try {
            const response = await axios.post("/auth/refresh-token");
            set({ checkingAuth: false });
            return response.data;
        } catch (error) {
            set({ user: null, checkingAuth: false });
            throw error;
        }
    },
}));
```

### Explicacion de Zustand:

- **create()**: Crea un store con estado y acciones
- **set()**: Actualiza el estado del store
- **get()**: Obtiene el estado actual
- El store es accesible desde cualquier componente

### Uso del Store en Componentes:

```jsx
import { useUserStore } from './stores/useUserStore.js';

function LoginPage() {
    const { login, loading } = useUserStore();
    
    const handleSubmit = (e) => {
        e.preventDefault();
        login({ email, password });
    };
    
    return (
        <button disabled={loading}>
            {loading ? "Cargando..." : "Iniciar Sesion"}
        </button>
    );
}
```

### Store del Carrito (useCartStore.js)

```jsx
export const useCartStore = create((set, get) => ({
    cart: [],
    coupon: null,
    total: 0,
    subtotal: 0,
    isCouponApplied: false,

    getCartItems: async () => {
        try {
            const res = await axios.get('/cart');
            set({cart: res.data});
            get().calculateTotals();
        } catch(error) {
            set({cart: []});
            toast.error(error.response.data.message || "An error occurred");
        }
    },

    addToCart: async (product) => {
        try {
            const res = await axios.post('/cart', {productId: product._id});
            toast.success("Product added to cart");
            
            set((prevState) => {
                const existingItem = prevState.cart.find((item) => item._id === product._id);
                const newCart = existingItem
                    ? prevState.cart.map((item) =>
                        item._id === product._id 
                            ? { ...item, quantity: item.quantity + 1 } 
                            : item
                      )
                    : [...prevState.cart, { ...product, quantity: 1 }];
                return { cart: newCart };
            });
            
            get().calculateTotals();
        } catch(error) {
            toast.error(error.response.data.message || "An error occurred");
        }
    },

    calculateTotals: () => {
        const {cart, coupon} = get();
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        let total = subtotal;
        
        if(coupon) {
            const discount = subtotal * (coupon.discountPercentage / 100);
            total = subtotal - discount;
        }

        set({subtotal, total});
    },
}));
```

### Explicacion de addToCart:

1. Hace una peticion POST a la API
2. Muestra una notificacion de exito
3. Actualiza el estado local del carrito
4. Si el producto ya existe, incrementa la cantidad
5. Si es nuevo, lo agrega con cantidad 1
6. Recalcula los totales

---

## 5. Configuracion de Axios (lib/axios.js)

```jsx
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development" 
        ? "http://localhost:4000/api" 
        : "/api",
    withCredentials: true,
});

export default axiosInstance;
```

### Explicacion:

- **baseURL**: URL base para todas las peticiones
  - En desarrollo: servidor local en puerto 4000
  - En produccion: ruta relativa (mismo servidor)
- **withCredentials**: Incluye cookies en las peticiones (necesario para autenticacion)

### Interceptores para Refresh Token:

```jsx
let refreshPromise = null;

axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                if (refreshPromise) {
                    await refreshPromise;
                    return axios(originalRequest);
                }

                refreshPromise = useUserStore.getState().refreshToken();
                await refreshPromise;
                refreshPromise = null;

                return axios(originalRequest);
            } catch (refreshError) {
                useUserStore.getState().logout();
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);
```

### Explicacion del Interceptor:

1. Si una peticion falla con error 401 (no autorizado)
2. Intenta refrescar el access token
3. Si tiene exito, reintenta la peticion original
4. Si falla, cierra la sesion del usuario

---

## 6. Componentes Principales

### Navbar (components/Navbar.jsx)

El navbar es la barra de navegacion superior que aparece en todas las paginas. Contiene:
- Logo de la aplicacion
- Enlaces a categorias
- Boton del carrito con contador
- Opciones de usuario (login/logout)
- Enlace al dashboard (solo para admins)

### ProductCard (components/ProductCard.jsx)

Tarjeta que muestra la informacion de un producto:
- Imagen del producto
- Nombre y descripcion
- Precio
- Boton para agregar al carrito

### CartItem (components/CartItem.jsx)

Item individual del carrito que muestra:
- Imagen del producto
- Nombre y precio
- Controles para cambiar cantidad
- Boton para eliminar

### LoadingSpinner (components/LoadingSpinner.jsx)

Indicador de carga que se muestra mientras:
- Se verifica la autenticacion
- Se cargan datos de la API

---

## 7. Paginas Principales

### HomePage

Pagina principal que muestra:
- Categorias de productos
- Productos destacados
- Llamada a la accion

### CategoryPage

Muestra todos los productos de una categoria especifica usando el parametro de la URL.

### CartPage

Pagina del carrito que incluye:
- Lista de items del carrito
- Formulario para aplicar cupones
- Resumen del pedido con totales
- Boton para proceder al pago
- Productos recomendados

### AdminPage

Panel de administracion (solo para usuarios admin) que permite:
- Ver lista de productos
- Crear nuevos productos
- Eliminar productos
- Marcar productos como destacados
- Ver estadisticas de ventas

### PurchaseSuccessPage

Se muestra despues de un pago exitoso:
- Confirmacion de la compra
- Detalles del pedido
- Animacion de confeti

### PurchaseCancelPage

Se muestra cuando el usuario cancela el pago:
- Mensaje informativo
- Opcion para volver al carrito
