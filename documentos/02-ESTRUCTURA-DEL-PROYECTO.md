# Estructura del Proyecto

Este documento explica la organizacion de carpetas y archivos del proyecto MERN Application.

---

## Vision General

```
MERN Application/
|-- package.json          # Configuracion principal del proyecto
|-- README.md             # Documentacion basica
|-- backend/              # Codigo del servidor (Node.js + Express)
|-- frontend/             # Codigo del cliente (React + Vite)
|-- documentos/           # Documentacion detallada
```

---

## Archivo package.json (Raiz)

El archivo `package.json` en la raiz del proyecto define la configuracion global:

```json
{
  "name": "mern-application",
  "version": "1.0.0",
  "main": "backend/server.js",
  "type": "module",
  "scripts": {
    "dev": "nodemon backend/server.js",
    "start": "node backend/server.js",
    "build": "npm install && npm install --prefix frontend && npm run build --prefix frontend"
  }
}
```

### Explicacion de los scripts:

- **dev**: Inicia el servidor en modo desarrollo con nodemon (reinicia automaticamente al detectar cambios)
- **start**: Inicia el servidor en modo produccion
- **build**: Instala dependencias y construye el frontend para produccion

### Dependencias principales del backend:

| Dependencia | Descripcion |
|-------------|-------------|
| express | Framework para crear el servidor web |
| mongoose | ODM para conectar con MongoDB |
| bcryptjs | Encriptacion de contrasenas |
| jsonwebtoken | Generacion y verificacion de JWT |
| ioredis | Cliente para conectar con Redis |
| cloudinary | SDK para subir imagenes |
| stripe | SDK para procesar pagos |
| cookie-parser | Parsear cookies de las peticiones |
| cors | Habilitar peticiones cross-origin |
| dotenv | Cargar variables de entorno |

---

## Carpeta backend/

La carpeta backend contiene todo el codigo del servidor.

```
backend/
|-- server.js             # Punto de entrada del servidor
|-- controllers/          # Logica de negocio
|-- lib/                  # Configuracion de servicios externos
|-- middleware/           # Funciones intermedias
|-- models/               # Esquemas de la base de datos
|-- routes/               # Definicion de endpoints de la API
```

### server.js

Este es el archivo principal que:
1. Importa todas las dependencias necesarias
2. Configura los middleware globales
3. Define las rutas de la API
4. Inicia el servidor y conecta a la base de datos

### Carpeta controllers/

Contiene la logica de negocio de la aplicacion. Cada controlador maneja un conjunto relacionado de operaciones:

| Archivo | Responsabilidad |
|---------|-----------------|
| auth.controller.js | Registro, login, logout, tokens |
| product.controller.js | CRUD de productos |
| cart.controller.js | Gestion del carrito |
| coupon.controller.js | Cupones de descuento |
| payment.controller.js | Procesamiento de pagos con Stripe |
| analytics.controller.js | Estadisticas de ventas |

### Carpeta lib/

Contiene la configuracion de servicios externos:

| Archivo | Servicio |
|---------|----------|
| db.js | Conexion a MongoDB |
| redis.js | Conexion a Redis (Upstash) |
| cloudinary.js | Configuracion de Cloudinary |
| stripe.js | Configuracion de Stripe |

### Carpeta middleware/

Contiene funciones que se ejecutan antes de los controladores:

| Archivo | Funcion |
|---------|---------|
| auth.middleware.js | Verificacion de autenticacion y permisos |

### Carpeta models/

Define la estructura de los datos en MongoDB usando Mongoose:

| Archivo | Entidad |
|---------|---------|
| user.model.js | Usuarios (nombre, email, contrasena, rol, carrito) |
| product.model.js | Productos (nombre, descripcion, precio, imagen, categoria) |
| order.model.js | Ordenes de compra |
| coupon.model.js | Cupones de descuento |

### Carpeta routes/

Define los endpoints de la API y los conecta con sus controladores:

| Archivo | Ruta base |
|---------|-----------|
| auth.route.js | /api/auth |
| product.route.js | /api/products |
| cart.route.js | /api/cart |
| coupon.route.js | /api/coupons |
| payment.route.js | /api/payments |
| analytics.route.js | /api/analytics |

---

## Carpeta frontend/

La carpeta frontend contiene la aplicacion React.

```
frontend/
|-- index.html            # Archivo HTML principal
|-- package.json          # Dependencias del frontend
|-- vite.config.js        # Configuracion de Vite
|-- tailwind.config.js    # Configuracion de Tailwind CSS
|-- public/               # Archivos estaticos
|-- src/                  # Codigo fuente
    |-- main.jsx          # Punto de entrada de React
    |-- App.jsx           # Componente principal y rutas
    |-- components/       # Componentes reutilizables
    |-- pages/            # Paginas de la aplicacion
    |-- stores/           # Estado global (Zustand)
    |-- lib/              # Utilidades y configuracion
```

### Dependencias principales del frontend:

| Dependencia | Descripcion |
|-------------|-------------|
| react | Biblioteca para construir interfaces |
| react-dom | Renderizado de React en el navegador |
| react-router-dom | Enrutamiento de la aplicacion |
| zustand | Gestion de estado global |
| axios | Cliente HTTP para peticiones a la API |
| tailwindcss | Framework de CSS utilitario |
| framer-motion | Animaciones |
| lucide-react | Iconos |
| react-hot-toast | Notificaciones |
| recharts | Graficas para el panel de analytics |
| @stripe/stripe-js | Integracion con Stripe en el frontend |

### Carpeta src/components/

Componentes reutilizables de la interfaz:

| Componente | Descripcion |
|------------|-------------|
| Navbar.jsx | Barra de navegacion superior |
| ProductCard.jsx | Tarjeta de producto |
| CartItem.jsx | Item del carrito |
| LoadingSpinner.jsx | Indicador de carga |
| CreateProductForm.jsx | Formulario para crear productos |
| AnalyticsTab.jsx | Graficas de estadisticas |
| FeaturedProducts.jsx | Carrusel de productos destacados |
| CategoryItem.jsx | Tarjeta de categoria |
| GiftCouponCard.jsx | Tarjeta de cupon de regalo |
| OrderSummary.jsx | Resumen del pedido |
| PeopleAlsoBought.jsx | Productos recomendados |
| ProductsList.jsx | Lista de productos para admin |

### Carpeta src/pages/

Paginas principales de la aplicacion:

| Pagina | Ruta | Descripcion |
|--------|------|-------------|
| HomePage.jsx | / | Pagina principal con categorias y productos destacados |
| SignUpPage.jsx | /signup | Formulario de registro |
| LoginPage.jsx | /login | Formulario de inicio de sesion |
| AdminPage.jsx | /secret-dashboard | Panel de administracion |
| CategoryPage.jsx | /category/:category | Productos por categoria |
| CartPage.jsx | /cart | Carrito de compras |
| PurchaseSuccessPage.jsx | /purchase-success | Confirmacion de compra exitosa |
| PurchaseCancelPage.jsx | /purchase-cancel | Compra cancelada |

### Carpeta src/stores/

Almacenes de estado global usando Zustand:

| Store | Responsabilidad |
|-------|-----------------|
| useUserStore.js | Estado del usuario (autenticacion) |
| useCartStore.js | Estado del carrito de compras |
| useProductStore.js | Estado de productos (admin) |

### Carpeta src/lib/

| Archivo | Descripcion |
|---------|-------------|
| axios.js | Configuracion de Axios con la URL base de la API |
