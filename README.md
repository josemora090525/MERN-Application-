# 🛒 MERN E-Commerce Application

<div align="center">

![MERN Stack](https://img.shields.io/badge/Stack-MERN-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Stripe](https://img.shields.io/badge/Stripe-008CDD?style=for-the-badge&logo=stripe&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

Una aplicación de comercio electrónico completa construida con el stack MERN, integrando servicios como Stripe para pagos, Redis para caché, y Cloudinary para almacenamiento de imágenes.

</div>

---

## Tabla de Contenidos

1. [¿Qué es el Stack MERN?](#-qué-es-el-stack-mern)
2. [¿Qué es una API?](#-qué-es-una-api)
3. [Tecnologías Utilizadas](#-tecnologías-utilizadas)
4. [Servicios Externos](#-servicios-externos)
5. [Estructura del Proyecto](#-estructura-del-proyecto)
6. [Instalación y Configuración](#-instalación-y-configuración)
7. [Variables de Entorno](#-variables-de-entorno)
8. [Backend - Explicación Detallada](#-backend---explicación-detallada)
9. [Frontend - Explicación Detallada](#-frontend---explicación-detallada)
10. [Endpoints de la API](#-endpoints-de-la-api)
11. [Uso de Postman](#-uso-de-postman)

---

## ¿Qué es el Stack MERN?

**MERN** es un acrónimo que representa un conjunto de tecnologías JavaScript utilizadas para construir aplicaciones web full-stack (completas):

| Letra | Tecnología | Descripción |
|-------|------------|-------------|
| **M** | **MongoDB** | Base de datos NoSQL orientada a documentos. Almacena datos en formato JSON/BSON, lo que facilita el trabajo con JavaScript. |
| **E** | **Express.js** | Framework minimalista para Node.js que simplifica la creación de servidores web y APIs. |
| **R** | **React** | Biblioteca de JavaScript para construir interfaces de usuario interactivas y reactivas. |
| **N** | **Node.js** | Entorno de ejecución de JavaScript del lado del servidor, permitiendo usar JS fuera del navegador. |

### ¿Por qué MERN?

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENTE (Navegador)                       │
│                           React + Vite                           │
│                    Interfaz de Usuario (UI)                      │
└────────────────────────────────┬────────────────────────────────┘
                                 │ HTTP Requests (API)
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                          SERVIDOR                                │
│                    Node.js + Express.js                          │
│              Lógica de negocio, Autenticación, APIs              │
└────────────────────────────────┬────────────────────────────────┘
                                 │ Queries
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                        BASE DE DATOS                             │
│                          MongoDB                                 │
│               Almacenamiento persistente de datos                │
└─────────────────────────────────────────────────────────────────┘
```

**Ventajas del Stack MERN:**
- **Un solo lenguaje**: JavaScript en todo el stack (frontend, backend y base de datos)
- **JSON nativo**: Los datos fluyen en formato JSON en toda la aplicación
- **NPM**: Acceso a millones de paquetes reutilizables
- **Rendimiento**: Node.js es excelente para aplicaciones en tiempo real
- **Comunidad**: Amplia comunidad y documentación disponible

---

## ¿Qué es una API?

**API** (Application Programming Interface - Interfaz de Programación de Aplicaciones) es un conjunto de reglas y protocolos que permite que diferentes aplicaciones se comuniquen entre sí.

### Analogía Simple

Imagina un **restaurante**:
- **Tú (Cliente)** = Frontend/Aplicación
- **El Mesero** = API
- **La Cocina** = Backend/Servidor

No entras directamente a la cocina a preparar tu comida. En su lugar, le dices al mesero (API) lo que quieres, él lleva tu pedido a la cocina (servidor), y te trae la respuesta (los datos o el resultado).

### API REST

Este proyecto utiliza una **API REST** (Representational State Transfer), que es un estilo arquitectónico para diseñar APIs web. Utiliza **métodos HTTP** para realizar operaciones:

| Método | Operación | Ejemplo |
|--------|-----------|---------|
| `GET` | Leer/Obtener datos | Obtener lista de productos |
| `POST` | Crear nuevos datos | Registrar un usuario |
| `PUT/PATCH` | Actualizar datos existentes | Actualizar un producto |
| `DELETE` | Eliminar datos | Eliminar un producto del carrito |

### Ejemplo de Petición API

```javascript
// Petición GET para obtener productos
fetch('http://localhost:4000/api/products')
  .then(response => response.json())
  .then(data => console.log(data));

// Petición POST para crear un producto
fetch('http://localhost:4000/api/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Camiseta',
    price: 29.99,
    category: 'ropa'
  })
});
```

---

## 🛠 Tecnologías Utilizadas

### Backend
| Tecnología | Propósito |
|------------|-----------|
| **Node.js** | Entorno de ejecución JavaScript del servidor |
| **Express.js** | Framework web para crear la API |
| **MongoDB** | Base de datos NoSQL |
| **Mongoose** | ODM (Object Document Mapper) para MongoDB |
| **JWT** | JSON Web Tokens para autenticación |
| **bcryptjs** | Encriptación de contraseñas |
| **cookie-parser** | Manejo de cookies HTTP |
| **cors** | Habilitar Cross-Origin Resource Sharing |

### Frontend
| Tecnología | Propósito |
|------------|-----------|
| **React 19** | Biblioteca UI para construir la interfaz |
| **Vite** | Herramienta de build ultrarrápida |
| **Tailwind CSS** | Framework CSS utilitario |
| **Zustand** | Gestión de estado global |
| **Axios** | Cliente HTTP para peticiones a la API |
| **React Router** | Navegación entre páginas |
| **Framer Motion** | Animaciones fluidas |
| **Recharts** | Gráficos para el dashboard |
| **Lucide React** | Iconos modernos |

---

## Servicios Externos

### Redis (Upstash)

**¿Qué es Redis?**
Redis es una base de datos en memoria de código abierto que se usa como caché, message broker y almacén de datos clave-valor. Es extremadamente rápida porque mantiene los datos en RAM.

**¿Para qué se usa en este proyecto?**

1. **Almacenamiento de Refresh Tokens**: Los tokens de actualización se guardan en Redis con expiración automática (7 días)
2. **Caché de Productos Destacados**: Los productos featured se cachean para evitar consultas repetitivas a MongoDB

```javascript
// Ejemplo: Almacenar refresh token en Redis
await redis.set(`refreshToken:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60);

// Ejemplo: Cachear productos destacados
await redis.set("featuredProducts", JSON.stringify(featuredProducts));
```

**¿Cómo configurar Redis con Upstash?**
1. Ve a [upstash.com](https://upstash.com)
2. Crea una cuenta gratuita
3. Crea una nueva base de datos Redis
4. Copia la URL de conexión y pégala en tu `.env`

---

### Stripe

**¿Qué es Stripe?**
Stripe es una plataforma de procesamiento de pagos online que permite aceptar tarjetas de crédito y otros métodos de pago de forma segura.

**¿Para qué se usa en este proyecto?**

1. **Checkout Sessions**: Crear sesiones de pago seguras
2. **Procesamiento de Pagos**: Manejar transacciones con tarjeta
3. **Cupones de Descuento**: Crear y aplicar cupones dinámicamente

```javascript
// Crear sesión de checkout en Stripe
const session = await stripe.checkout.sessions.create({
  payment_method_types: ["card"],
  line_items: lineItems,
  mode: "payment",
  success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
});
```

**¿Cómo configurar Stripe?**
1. Ve a [stripe.com](https://stripe.com) y crea una cuenta
2. En el Dashboard, ve a Developers → API Keys
3. Copia tu **Secret Key** (para el backend) y **Publishable Key** (para el frontend)
4. Usa el modo TEST para desarrollo (las claves empiezan con `sk_test_` y `pk_test_`)

---

### Cloudinary

**¿Qué es Cloudinary?**
Cloudinary es un servicio de gestión de imágenes y videos en la nube. Permite subir, almacenar, transformar y optimizar archivos multimedia.

**¿Para qué se usa en este proyecto?**

1. **Subida de Imágenes de Productos**: Las imágenes se suben a Cloudinary y se obtiene una URL
2. **Eliminación de Imágenes**: Cuando se elimina un producto, su imagen también se elimina

```javascript
// Subir imagen a Cloudinary
const cloudinaryResponse = await cloudinary.uploader.upload(image, {
  folder: "products"
});

// La imagen queda disponible en:
// cloudinaryResponse.secure_url
```

**¿Cómo configurar Cloudinary?**
1. Ve a [cloudinary.com](https://cloudinary.com) y crea una cuenta
2. En el Dashboard encontrarás: Cloud Name, API Key y API Secret
3. Copia estos valores a tu archivo `.env`

---

### Postman

**¿Qué es Postman?**
Postman es una herramienta para probar APIs. Permite enviar peticiones HTTP a tu servidor y ver las respuestas sin necesidad de un frontend.

**¿Para qué se usa en este proyecto?**
- Probar endpoints durante el desarrollo
- Verificar que las rutas funcionan correctamente
- Depurar errores en la API
- Documentar la API

**¿Cómo usar Postman con este proyecto?**

1. **Descarga Postman** desde [postman.com](https://www.postman.com/downloads/)
2. **Crea una nueva colección** llamada "MERN E-Commerce"
3. **Configura las peticiones**:

```
MERN E-Commerce
├── Auth
│   ├── POST /api/auth/signup
│   ├── POST /api/auth/login
│   ├── POST /api/auth/logout
│   └── GET  /api/auth/profile
├── Products
│   ├── GET  /api/products
│   ├── GET  /api/products/featured
│   └── POST /api/products (Admin)
├── Cart
│   ├── GET  /api/cart
│   ├── POST /api/cart
│   └── DELETE /api/cart
└── Payments
    └── POST /api/payments/create-checkout-session
```

**Ejemplo de petición en Postman:**

```
POST http://localhost:4000/api/auth/signup

Headers:
  Content-Type: application/json

Body (JSON):
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "123456"
}
```

---

## Estructura del Proyecto

```
MERN Application/
├── package.json              # Configuración del proyecto raíz
├── README.md                 # Este archivo
│
├── backend/                  # Código del servidor
│   ├── server.js             # Punto de entrada del servidor
│   │
│   ├── controllers/          # Lógica de negocio
│   │   ├── analytics.controller.js
│   │   ├── auth.controller.js
│   │   ├── cart.controller.js
│   │   ├── coupon.controller.js
│   │   ├── payment.controller.js
│   │   └── product.controller.js
│   │
│   ├── lib/                  # Configuración de servicios externos
│   │   ├── cloudinary.js
│   │   ├── db.js
│   │   ├── redis.js
│   │   └── stripe.js
│   │
│   ├── middleware/           # Funciones intermedias
│   │   └── auth.middleware.js
│   │
│   ├── models/               # Esquemas de base de datos
│   │   ├── coupon.model.js
│   │   ├── order.model.js
│   │   ├── product.model.js
│   │   └── user.model.js
│   │
│   └── routes/               # Definición de rutas API
│       ├── analytics.route.js
│       ├── auth.route.js
│       ├── cart.route.js
│       ├── coupon.route.js
│       ├── payment.route.js
│       └── product.route.js
│
└── frontend/                 # Código del cliente
    ├── 📄 index.html            # Archivo HTML principal
    ├── 📄 package.json          # Dependencias del frontend
    ├── 📄 vite.config.js        # Configuración de Vite
    ├── 📄 tailwind.config.js    # Configuración de Tailwind
    │
    └── src/
        ├── 📄 main.jsx          # Punto de entrada de React
        ├── 📄 App.jsx           # Componente principal
        ├── 📄 App.css           # Estilos globales
        ├── 📄 index.css         # Estilos de Tailwind
        │
        ├── components/       # Componentes reutilizables
        │   ├── AnalyticsTab.jsx
        │   ├── CartItem.jsx
        │   ├── CategoryItem.jsx
        │   ├── CreateProductForm.jsx
        │   ├── FeaturedProducts.jsx
        │   ├── GiftCouponCard.jsx
        │   ├── LoadingSpinner.jsx
        │   ├── Navbar.jsx
        │   ├── OrderSummary.jsx
        │   ├── PeopleAlsoBought.jsx
        │   ├── ProductCard.jsx
        │   └── ProductsList.jsx
        │
        ├── pages/            # Páginas/Vistas de la app
        │   ├── AdminPage.jsx
        │   ├── CartPage.jsx
        │   ├── CategoryPage.jsx
        │   ├── HomePage.jsx
        │   ├── LoginPage.jsx
        │   ├── PurchaseCancelPage.jsx
        │   ├── PurchaseSuccesPage.jsx
        │   └── SignUpPage.jsx
        │
        ├── stores/           # Estado global (Zustand)
        │   ├── useCartStore.js
        │   ├── useProductStore.js
        │   └── useUserStore.js
        │
        └── lib/              # Utilidades
            └── axios.js
```

---

## Instalación y Configuración

### Prerrequisitos

- **Node.js** (v18 o superior) - [Descargar](https://nodejs.org/)
- **MongoDB** - Puedes usar [MongoDB Atlas](https://www.mongodb.com/atlas) (gratuito en la nube)
- Cuentas en: **Stripe**, **Cloudinary**, **Upstash Redis**

### Pasos de Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/mern-ecommerce.git
cd mern-ecommerce

# 2. Instalar dependencias del backend
npm install

# 3. Instalar dependencias del frontend
cd frontend
npm install
cd ..

# 4. Crear archivo .env en la raíz (ver sección de variables de entorno)

# 5. Iniciar en modo desarrollo
npm run dev          # Backend en puerto 4000
cd frontend && npm run dev  # Frontend en puerto 5175
```

### Scripts Disponibles

```json
{
  "dev": "nodemon backend/server.js",    // Desarrollo con hot-reload
  "start": "node backend/server.js",      // Producción
  "build": "npm install && npm install --prefix frontend && npm run build --prefix frontend"
}
```

---

## Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Puerto del servidor
PORT=4000

# URL del cliente (frontend)
CLIENT_URL=http://localhost:5175

# Entorno
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/ecommerce

# Redis (Upstash)
UPSTASH_REDIS_URL=rediss://default:password@endpoint.upstash.io:6379

# JWT Secrets (genera claves seguras)
ACCESS_TOKEN_SECRET=tu_access_token_secret_super_seguro
REFRESH_TOKEN_SECRET=tu_refresh_token_secret_super_seguro

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Stripe
STRIPE_SECRET_KEY=sk_test_tu_stripe_secret_key
```

---

## Backend - Explicación Detallada

### server.js - Punto de Entrada

Este es el archivo principal que configura y arranca el servidor Express:

```javascript
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

// Importar rutas
import authRoutes from './routes/auth.route.js';
import productRoutes from './routes/product.route.js';
// ... más rutas

dotenv.config(); // Cargar variables de entorno

const app = express();

// Middlewares
app.use(cors({
    origin: process.env.CLIENT_URL,  // Permitir peticiones del frontend
    credentials: true                 // Permitir cookies
}));
app.use(express.json({limit: '10mb'})); // Parsear JSON (importante para imágenes)
app.use(cookieParser());                 // Parsear cookies

// Rutas de la API
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
// ... más rutas

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    connectDB(); // Conectar a MongoDB
});
```

**Conceptos Clave:**
- `express()`: Crea la aplicación Express
- `app.use()`: Registra middlewares (funciones que procesan cada petición)
- `cors`: Permite que el frontend (otro origen) haga peticiones al backend
- `cookieParser`: Permite leer cookies de las peticiones

---

### Controllers - Lógica de Negocio

Los controllers contienen la lógica que se ejecuta cuando se accede a una ruta.

#### auth.controller.js - Autenticación

```javascript
// Generar tokens JWT
const generateTokens = (userId) => {
    // Access Token: corta duración (15 min), usado en cada petición
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { 
        expiresIn: '15m' 
    });
    
    // Refresh Token: larga duración (7 días), usado para renovar access token
    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { 
        expiresIn: '7d' 
    });

    return { accessToken, refreshToken };
}

// Configurar cookies seguras
const setCookies = (res, accessToken, refreshToken) => {
    res.cookie('accessToken', accessToken, {
        httpOnly: true,     // No accesible via JavaScript (previene XSS)
        secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
        sameSite: 'strict', // Previene CSRF
        maxAge: 15 * 60 * 1000, // 15 minutos
    });
    // ... similar para refreshToken
}

// Registro de usuario
export const signup = async (req, res) => {
    const { email, password, name } = req.body;
    
    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: "User already exists" });
    }

    // Crear usuario (la contraseña se hashea automáticamente)
    const user = await User.create({ name, email, password });

    // Generar tokens y establecer cookies
    const { accessToken, refreshToken } = generateTokens(user._id);
    await storeRefreshToken(user._id, refreshToken);
    setCookies(res, accessToken, refreshToken);

    res.status(201).json({ user });
}
```

**Sistema de Tokens JWT:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    FLUJO DE AUTENTICACIÓN                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Usuario hace login/signup                                    │
│              ▼                                                   │
│  2. Servidor genera 2 tokens:                                    │
│     • Access Token (15 min) → Cookie httpOnly                    │
│     • Refresh Token (7 días) → Cookie httpOnly + Redis           │
│              ▼                                                   │
│  3. Usuario hace peticiones con Access Token                     │
│              ▼                                                   │
│  4. Access Token expira? → Usar Refresh Token para renovar       │
│              ▼                                                   │
│  5. Refresh Token expira? → Usuario debe hacer login de nuevo    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

#### product.controller.js - Gestión de Productos

```javascript
// Obtener productos destacados (con caché Redis)
export const getFeaturedProducts = async (req, res) => {
    // Primero buscar en caché (Redis)
    let featuredProducts = await redis.get("featuredProducts");
    
    if (featuredProducts) {
        // Si existe en caché, devolver directamente (muy rápido)
        return res.json(JSON.parse(featuredProducts));
    }

    // Si no está en caché, buscar en MongoDB
    featuredProducts = await Product.find({ isFeatured: true }).lean();

    // Guardar en caché para futuras peticiones
    await redis.set("featuredProducts", JSON.stringify(featuredProducts));

    res.json({ featuredProducts });
}

// Crear producto con imagen en Cloudinary
export const createProduct = async (req, res) => {
    const { name, description, price, image, category } = req.body;

    // Subir imagen a Cloudinary
    let cloudinaryResponse = null;
    if (image) {
        cloudinaryResponse = await cloudinary.uploader.upload(image, {
            folder: "products"  // Carpeta en Cloudinary
        });
    }

    // Crear producto en MongoDB
    const product = await Product.create({
        name,
        description,
        price,
        category,
        image: cloudinaryResponse?.secure_url || "",
    });

    res.status(201).json(product);
}
```

---

### Models - Esquemas de Base de Datos

Los modelos definen la estructura de los documentos en MongoDB usando Mongoose.

#### user.model.js

```javascript
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,        // No puede haber emails duplicados
        lowercase: true,     // Convierte a minúsculas automáticamente
    },
    password: {
        type: String,
        required: true,
        minlength: [6, "Password must be at least 6 characters"],
    },
    cartItems: [{
        quantity: { type: Number, default: 1 },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",  // Referencia al modelo Product
        },
    }],
    role: {
        type: String,
        enum: ["customer", "admin"],  // Solo estos valores permitidos
        default: "customer",
    },
}, { timestamps: true });  // Añade createdAt y updatedAt

// Hook pre-save: hashear contraseña antes de guardar
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;  // Solo si cambió la contraseña
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

export default mongoose.model("User", userSchema);
```

---

### Middleware - Funciones Intermedias

Los middlewares procesan las peticiones antes de que lleguen a los controllers.

#### auth.middleware.js

```javascript
// Proteger rutas - verificar que el usuario está autenticado
export const protectRoute = async (req, res, next) => {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
        return res.status(401).json({ message: "No access token provided" });
    }

    try {
        // Verificar el token
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        
        // Buscar usuario y adjuntarlo a la request
        const user = await User.findById(decoded.userId).select("-password");
        req.user = user;
        
        next();  // Continuar al siguiente middleware/controller
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired" });
        }
        return res.status(401).json({ message: "Invalid token" });
    }
}

// Solo permitir acceso a administradores
export const adminRoute = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        return res.status(403).json({ message: "Access denied - Admins only" });
    }
}
```

**Flujo de Middleware:**

```
Petición HTTP → cors → express.json → cookieParser → protectRoute → Controller
                                                           │
                                                           ▼
                                                    ¿Token válido?
                                                     │        │
                                                    Sí        No
                                                     │        │
                                                     ▼        ▼
                                               Continuar   Error 401
```

---

## Frontend - Explicación Detallada

### App.jsx - Componente Principal

```jsx
import { Route, Routes, Navigate } from "react-router-dom";
import { useUserStore } from "./stores/useUserStore.js";
import { useEffect } from "react";

function App() {
  const { user, checkAuth, checkingAuth } = useUserStore();
  const { getCartItems } = useCartStore();

  // Verificar autenticación al cargar la app
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Cargar carrito si el usuario está autenticado
  useEffect(() => {
    if (!user) return;
    getCartItems();
  }, [getCartItems, user]);

  // Mostrar spinner mientras se verifica la autenticación
  if (checkingAuth) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        
        {/* Rutas públicas - redirigir si ya está autenticado */}
        <Route path='/signup' element={!user ? <SignUpPage /> : <Navigate to='/' />} />
        <Route path='/login' element={!user ? <LoginPage /> : <Navigate to='/' />} />
        
        {/* Ruta protegida - solo admin */}
        <Route path='/secret-dashboard' element={
          user?.role === "admin" ? <AdminPage /> : <Navigate to='/login' />
        } />
        
        {/* Rutas protegidas - requieren autenticación */}
        <Route path='/cart' element={user ? <CartPage /> : <Navigate to='/login' />} />
      </Routes>
    </div>
  );
}
```

---

### Stores - Gestión de Estado con Zustand

Zustand es una librería de gestión de estado minimalista para React.

#### useUserStore.js

```javascript
import { create } from 'zustand';
import axios from '../lib/axios.js';
import { toast } from 'react-hot-toast';

export const useUserStore = create((set, get) => ({
    user: null,           // Usuario actual
    loading: false,       // Estado de carga
    checkingAuth: true,   // Verificando autenticación inicial

    signup: async ({ name, email, password, confirmPassword }) => {
        set({ loading: true });

        if (password !== confirmPassword) {
            set({ loading: false });
            return toast.error("Passwords do not match");
        }

        try {
            const res = await axios.post('/auth/signup', { name, email, password });
            set({ user: res.data, loading: false });
            toast.success("Signup successful");
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "Error");
        }
    },

    checkAuth: async () => {
        set({ checkingAuth: true });
        try {
            const response = await axios.get('/auth/profile');
            set({ user: response.data, checkingAuth: false });
        } catch (error) {
            set({ checkingAuth: false, user: null });
        }
    },

    // Interceptor para renovar tokens automáticamente
    refreshToken: async () => {
        const response = await axios.post("/auth/refresh-token");
        return response.data;
    },
}));

// Axios interceptor para manejar tokens expirados
axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401 && !error.config._retry) {
            error.config._retry = true;
            await useUserStore.getState().refreshToken();
            return axios(error.config);  // Reintentar la petición
        }
        return Promise.reject(error);
    }
);
```

---

### lib/axios.js - Configuración de Axios

```javascript
import axios from 'axios';

const axiosInstance = axios.create({
    // En desarrollo: apuntar al servidor local
    // En producción: usar rutas relativas (mismo dominio)
    baseURL: import.meta.env.MODE === "development" 
        ? "http://localhost:4000/api" 
        : "/api",
    withCredentials: true,  // Enviar cookies con cada petición
});

export default axiosInstance;
```

---

## 📡 Endpoints de la API

### Autenticación (`/api/auth`)

| Método | Endpoint | Descripción | Protegida |
|--------|----------|-------------|-----------|
| POST | `/signup` | Registrar usuario | ❌ |
| POST | `/login` | Iniciar sesión | ❌ |
| POST | `/logout` | Cerrar sesión | ❌ |
| POST | `/refresh-token` | Renovar access token | ❌ |
| GET | `/profile` | Obtener perfil | ✅ |

### Productos (`/api/products`)

| Método | Endpoint | Descripción | Protegida |
|--------|----------|-------------|-----------|
| GET | `/` | Obtener todos los productos | ❌ |
| GET | `/featured` | Productos destacados | ❌ |
| GET | `/category/:category` | Productos por categoría | ❌ |
| GET | `/recommendations` | Productos recomendados | ❌ |
| POST | `/` | Crear producto | ✅ Admin |
| PATCH | `/:id` | Toggle featured | ✅ Admin |
| DELETE | `/:id` | Eliminar producto | ✅ Admin |

### Carrito (`/api/cart`)

| Método | Endpoint | Descripción | Protegida |
|--------|----------|-------------|-----------|
| GET | `/` | Obtener carrito | ✅ |
| POST | `/` | Añadir al carrito | ✅ |
| DELETE | `/` | Eliminar del carrito | ✅ |
| PUT | `/:id` | Actualizar cantidad | ✅ |

### Pagos (`/api/payments`)

| Método | Endpoint | Descripción | Protegida |
|--------|----------|-------------|-----------|
| POST | `/create-checkout-session` | Crear sesión de pago | ✅ |
| POST | `/checkout-success` | Confirmar pago exitoso | ✅ |

### Cupones (`/api/coupons`)

| Método | Endpoint | Descripción | Protegida |
|--------|----------|-------------|-----------|
| GET | `/` | Obtener cupón del usuario | ✅ |
| POST | `/validate` | Validar código de cupón | ✅ |

---

## Uso de Postman

### Configuración Inicial

1. **Crear un Environment** con la variable `base_url = http://localhost:4000/api`
2. **Importar la colección** o crear las peticiones manualmente

### Ejemplos de Peticiones

#### 1. Registro de Usuario
```
POST {{base_url}}/auth/signup
Body (raw JSON):
{
    "name": "Test User",
    "email": "test@example.com",
    "password": "123456"
}
```

#### 2. Iniciar Sesión
```
POST {{base_url}}/auth/login
Body (raw JSON):
{
    "email": "test@example.com",
    "password": "123456"
}
```

#### 3. Crear Producto (Admin)
```
POST {{base_url}}/products
Body (raw JSON):
{
    "name": "Camiseta Negra",
    "description": "Camiseta de algodón 100%",
    "price": 29.99,
    "category": "clothes",
    "image": "data:image/jpeg;base64,..." 
}
```

### Tips para Postman

1. **Cookies**: Postman maneja automáticamente las cookies si habilitas "Send cookies with request"
2. **Variables**: Usa `{{variable}}` para valores reutilizables
3. **Tests**: Puedes escribir tests automáticos para verificar respuestas
4. **Collections**: Organiza tus peticiones por módulos (Auth, Products, Cart, etc.)

---

## Deploy

Para desplegar la aplicación en producción:

1. **Build del Frontend**:
```bash
npm run build
```

2. **Variables de Entorno**: Configura `NODE_ENV=production`

3. **Plataformas Recomendadas**:
   - **Backend**: Railway, Render, Heroku
   - **Base de Datos**: MongoDB Atlas
   - **Redis**: Upstash Redis
   - **Full Stack**: Vercel, Railway

---

## Licencia

Este proyecto está bajo la Licencia ISC.

---




