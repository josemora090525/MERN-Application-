# Backend - Servidor y API

Este documento explica en detalle el funcionamiento del backend, incluyendo fragmentos de codigo importantes.

---

## 1. Servidor Principal (server.js)

El archivo `server.js` es el punto de entrada de la aplicacion. Aqui se configura Express y se definen todas las rutas.

```javascript
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from "path";

// Importar rutas
import authRoutes from './routes/auth.route.js';
import productRoutes from './routes/product.route.js';
import cartRoutes from './routes/cart.route.js';
import couponRoutes from './routes/coupon.route.js';
import paymentRoutes from './routes/payment.route.js';
import analyticsRoutes from './routes/analytics.route.js';

import { connectDB } from './lib/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
```

### Explicacion:

- **express()**: Crea una instancia de la aplicacion Express
- **dotenv.config()**: Carga las variables de entorno desde el archivo .env
- **PORT**: Puerto donde escuchara el servidor (4000 por defecto)

### Configuracion de Middleware:

```javascript
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5175",
    credentials: true
}));
app.use(express.json({limit: '10mb'}));
app.use(cookieParser());
```

- **cors()**: Permite peticiones desde el frontend (necesario porque el frontend y backend corren en puertos diferentes durante desarrollo)
- **express.json()**: Permite recibir datos en formato JSON en el cuerpo de las peticiones
- **cookieParser()**: Permite leer las cookies enviadas por el cliente

### Definicion de Rutas:

```javascript
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);
```

Cada linea asocia una ruta base con un archivo de rutas. Por ejemplo, todas las rutas definidas en `authRoutes` tendran el prefijo `/api/auth`.

### Modo Produccion:

```javascript
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));

    app.get(/.*/, (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
}
```

En produccion, el servidor sirve los archivos estaticos del frontend compilado. Cualquier ruta que no sea de la API devuelve el archivo index.html, permitiendo que React maneje el enrutamiento del lado del cliente.

---

## 2. Conexion a la Base de Datos (lib/db.js)

```javascript
import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch(error) {
        console.log("Error connecting to MONGODB", error.message);
        process.exit(1);
    }
}
```

### Explicacion:

- **mongoose.connect()**: Establece la conexion con MongoDB usando la URI almacenada en las variables de entorno
- **process.exit(1)**: Termina el proceso con codigo de error si la conexion falla

---

## 3. Modelos de Datos

Los modelos definen la estructura de los documentos en MongoDB usando Mongoose.

### Modelo de Usuario (user.model.js)

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
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],
    },
    cartItems: [{
        quantity: {
            type: Number,
            default: 1,
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
    }],
    role: {
        type: String,
        enum: ["customer", "admin"],
        default: "customer",
    },
}, { timestamps: true });
```

### Explicacion del esquema:

- **type**: Tipo de dato (String, Number, Boolean, etc.)
- **required**: Campo obligatorio con mensaje de error personalizado
- **unique**: Valor unico en la coleccion
- **lowercase**: Convierte a minusculas automaticamente
- **trim**: Elimina espacios al inicio y final
- **enum**: Lista de valores permitidos
- **default**: Valor por defecto
- **ref**: Referencia a otro modelo (relacion)
- **timestamps**: Agrega automaticamente createdAt y updatedAt

### Hook Pre-Save para Encriptar Contrasena:

```javascript
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});
```

Este hook se ejecuta automaticamente antes de guardar un usuario. Si la contrasena fue modificada, la encripta usando bcrypt con un salt de factor 10.

### Metodo para Comparar Contrasenas:

```javascript
userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};
```

Este metodo compara una contrasena en texto plano con la contrasena encriptada almacenada.

### Modelo de Producto (product.model.js)

```javascript
const productSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    price: {
        type: Number,
        min: 0,
        required: true
    },
    image: {
        type: String,
        required: [true, "Image is required"]
    },
    category: {
        type: String,
        required: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
```

### Modelo de Orden (order.model.js)

```javascript
const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
    }],
    totalAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    stripeSessionId: {
        type: String,
        unique: true,
    },
}, { timestamps: true });
```

### Modelo de Cupon (coupon.model.js)

```javascript
const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    discountPercentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
    },
    expirationDate: {
        type: Date,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
}, { timestamps: true });
```

---

## 4. Rutas de la API

Las rutas definen los endpoints de la API y los conectan con sus controladores.

### Rutas de Autenticacion (auth.route.js)

```javascript
import express from "express";
import { logout, login, signup, refreshToken, getProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
router.get("/profile", protectRoute, getProfile);

export default router;
```

| Metodo | Ruta | Middleware | Controlador | Descripcion |
|--------|------|------------|-------------|-------------|
| POST | /api/auth/signup | - | signup | Registrar nuevo usuario |
| POST | /api/auth/login | - | login | Iniciar sesion |
| POST | /api/auth/logout | - | logout | Cerrar sesion |
| POST | /api/auth/refresh-token | - | refreshToken | Renovar access token |
| GET | /api/auth/profile | protectRoute | getProfile | Obtener perfil del usuario |

### Rutas de Productos (product.route.js)

```javascript
import express from 'express';
import { getAllProducts, getFeaturedProducts, createProduct, deleteProduct, 
         getRecommendedProducts, getProductsByCategory, toggleFeaturedProduct } 
         from '../controllers/product.controller.js';
import { adminRoute, protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get("/", protectRoute, adminRoute, getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/recommendations", getRecommendedProducts);
router.post("/", protectRoute, adminRoute, createProduct);
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct);
router.delete("/:id", protectRoute, adminRoute, deleteProduct);

export default router;
```

| Metodo | Ruta | Middleware | Descripcion |
|--------|------|------------|-------------|
| GET | /api/products | protectRoute, adminRoute | Obtener todos (solo admin) |
| GET | /api/products/featured | - | Productos destacados |
| GET | /api/products/category/:category | - | Productos por categoria |
| GET | /api/products/recommendations | - | Productos recomendados |
| POST | /api/products | protectRoute, adminRoute | Crear producto (solo admin) |
| PATCH | /api/products/:id | protectRoute, adminRoute | Toggle destacado (solo admin) |
| DELETE | /api/products/:id | protectRoute, adminRoute | Eliminar (solo admin) |

---

## 5. Middleware de Autenticacion

El middleware verifica la autenticacion y autorizacion de los usuarios.

### protectRoute

```javascript
export const protectRoute = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;

        if (!accessToken) {
            return res.status(401).json({message: "Unauthorized - No access token provided"});
        }
        
        try {
            const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            const user = await User.findById(decoded.userId).select("-password");

            if (!user) {
                return res.status(401).json({message: "User not found"});
            }

            req.user = user;
            next();

        } catch(error) {
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({message: "Unauthorized - Access token expired"});
            }
            throw error;
        }

    } catch(error) {
        console.log("Error in protectRoute middleware:", error.message);
        return res.status(401).json({message: "Unauthorized - Invalid access token"});
    }
}
```

### Explicacion:

1. Obtiene el accessToken de las cookies
2. Si no existe, responde con error 401 (No autorizado)
3. Verifica el token usando la clave secreta
4. Busca el usuario en la base de datos
5. Agrega el usuario a `req.user` para que este disponible en los controladores
6. Llama a `next()` para continuar con el siguiente middleware o controlador

### adminRoute

```javascript
export const adminRoute = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        return res.status(403).json({message: "Access denied - Admins only"});
    }
}
```

Este middleware verifica que el usuario tenga rol de administrador.

---

## 6. Controladores

Los controladores contienen la logica de negocio.

### Controlador de Autenticacion (auth.controller.js)

#### Generacion de Tokens:

```javascript
const generateTokens = (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    return { accessToken, refreshToken };
}
```

- **jwt.sign()**: Crea un token con el payload, clave secreta y opciones
- El access token expira en 15 minutos
- El refresh token expira en 7 dias

#### Almacenamiento del Refresh Token en Redis:

```javascript
const storeRefreshToken = async (userId, refreshToken) => {
    await redis.set(`refreshToken:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60);
}
```

- El token se almacena con una clave unica por usuario
- "EX" indica tiempo de expiracion en segundos
- Esto permite invalidar tokens al cerrar sesion

#### Configuracion de Cookies:

```javascript
const setCookies = (res, accessToken, refreshToken) => {
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
}
```

#### Registro de Usuario:

```javascript
export const signup = async (req, res) => {
    const { email, password, name } = req.body;
    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await User.create({ name, email, password });

        const {accessToken, refreshToken} = generateTokens(user._id);
        await storeRefreshToken(user._id, refreshToken);

        setCookies(res, accessToken, refreshToken);
        
        res.status(201).json({ 
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } catch (error) {
        console.log("Error in signup controller:", error.message);
        res.status(500).json({ message: error.message });
    }
}
```

### Controlador de Productos (product.controller.js)

#### Obtener Productos Destacados con Cache de Redis:

```javascript
export const getFeaturedProducts = async (req, res) => {
    try {
        let featuredProducts = await redis.get("featuredProducts");
        if (featuredProducts) {
            return res.json(JSON.parse(featuredProducts));
        }

        // Si no esta en redis, buscar en MongoDB
        featuredProducts = await Product.find({isFeatured: true}).lean();

        if (!featuredProducts) {
            return res.status(404).json({message: "No featured products found"});
        }

        // Guardar en redis para acceso rapido
        await redis.set("featuredProducts", JSON.stringify(featuredProducts));

        res.json({featuredProducts});
    } catch(error) {
        console.log("Error in getFeaturedProducts controller:", error.message);
        res.status(500).json({message: "Server error", error: error.message});
    }
};
```

### Explicacion:

1. Primero intenta obtener los productos de Redis (cache)
2. Si existen en cache, los devuelve inmediatamente
3. Si no, consulta MongoDB
4. Guarda el resultado en Redis para futuras peticiones
5. `.lean()` devuelve objetos JavaScript simples en lugar de documentos Mongoose, mejorando el rendimiento

#### Crear Producto con Subida de Imagen a Cloudinary:

```javascript
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, image, category } = req.body;

        let cloudinaryResponse = null;

        if (image) {
            cloudinaryResponse = await cloudinary.uploader.upload(image, {folder: "products"});
        }

        const product = await Product.create({
            name,
            description,
            price,
            category,
            image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
        });

        res.status(201).json(product);
    } catch(error) {
        console.log("Error in createProduct controller:", error.message);
        res.status(500).json({message: "Server error", error: error.message});
    }
}
```

#### Obtener Productos Recomendados con Agregacion:

```javascript
export const getRecommendedProducts = async (req, res) => {
    try {
        const products = await Product.aggregate([
            {
                $sample: { size: 4 },
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    image: 1,
                    price: 1,
                },
            },
        ]);

        res.json(products);
    } catch (error) {
        console.log("Error in getRecommendedProducts controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
```

### Explicacion de la Agregacion:

- **$sample**: Selecciona documentos aleatorios (4 en este caso)
- **$project**: Define que campos incluir en el resultado (1 = incluir, 0 = excluir)
