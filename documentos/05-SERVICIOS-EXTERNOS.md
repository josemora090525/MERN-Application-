# Servicios Externos

Este documento explica los servicios externos utilizados en el proyecto, como configurarlos y para que sirven.

---

## 1. MongoDB Atlas

### Que es MongoDB Atlas

MongoDB Atlas es la version en la nube de MongoDB. En lugar de instalar y mantener una base de datos localmente, Atlas proporciona una base de datos gestionada en la nube con:

- Alta disponibilidad
- Copias de seguridad automaticas
- Escalabilidad automatica
- Panel de administracion web

### Como configurar MongoDB Atlas

1. Ir a https://www.mongodb.com/atlas
2. Crear una cuenta gratuita
3. Crear un nuevo cluster (la version gratuita es suficiente para desarrollo)
4. En "Database Access", crear un usuario con contrasena
5. En "Network Access", agregar tu direccion IP (o 0.0.0.0/0 para permitir todas)
6. En "Connect", obtener la cadena de conexion

### Formato de la URI de conexion

```
mongodb+srv://<usuario>:<contrasena>@<cluster>.mongodb.net/<nombre_db>?retryWrites=true&w=majority
```

### Variable de entorno

En el archivo `.env`:
```
MONGO_URI=<TU_URI_DE_MONGODB>
```

### Codigo de conexion (lib/db.js)

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

---

## 2. Redis (Upstash)

### Que es Redis

Redis es una base de datos en memoria de tipo clave-valor. Es extremadamente rapida porque almacena datos en RAM en lugar de en disco. Se usa principalmente para:

- Cache de datos frecuentemente accedidos
- Sesiones de usuario
- Colas de mensajes
- Almacenamiento temporal

### Por que usar Redis en este proyecto

En este proyecto, Redis se usa para:

1. **Cache de productos destacados**: Evita consultar MongoDB cada vez
2. **Almacenamiento de refresh tokens**: Permite invalidar tokens al cerrar sesion

### Que es Upstash

Upstash es un servicio de Redis en la nube que ofrece:

- Plan gratuito generoso
- Facturacion por uso (pay-per-request)
- Compatible con clientes Redis estandar
- No requiere servidor propio

### Como configurar Upstash

1. Ir a https://upstash.com
2. Crear una cuenta gratuita
3. Crear una nueva base de datos Redis
4. Copiar la URL de conexion (Redis REST URL)

### Variable de entorno

```
UPSTASH_REDIS_URL=<TU_URL_DE_REDIS>
```

### Codigo de conexion (lib/redis.js)

```javascript
import Redis from "ioredis";
import dotenv from "dotenv";    

dotenv.config();

export const redis = new Redis(process.env.UPSTASH_REDIS_URL);
```

### Uso de Redis en el proyecto

#### Almacenar Refresh Token:

```javascript
await redis.set(`refreshToken:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60);
```

- `set`: Guarda un valor con una clave
- `EX`: Define tiempo de expiracion en segundos
- `7 * 24 * 60 * 60`: 7 dias en segundos

#### Obtener datos cacheados:

```javascript
let featuredProducts = await redis.get("featuredProducts");
if (featuredProducts) {
    return res.json(JSON.parse(featuredProducts));
}
```

#### Eliminar Refresh Token (logout):

```javascript
await redis.del(`refreshToken:${decoded.userId}`);
```

---

## 3. Cloudinary

### Que es Cloudinary

Cloudinary es un servicio de gestion de imagenes y videos en la nube. Ofrece:

- Almacenamiento de archivos multimedia
- Transformacion de imagenes (redimensionar, recortar, filtros)
- Entrega optimizada via CDN
- URLs seguras

### Por que usar Cloudinary

En lugar de almacenar imagenes en el servidor o en MongoDB (lo cual seria ineficiente), Cloudinary:

- Optimiza el tamano de las imagenes automaticamente
- Entrega las imagenes desde servidores cercanos al usuario (CDN)
- Proporciona URLs directas para cada imagen

### Como configurar Cloudinary

1. Ir a https://cloudinary.com
2. Crear una cuenta gratuita
3. En el dashboard, obtener:
   - Cloud Name
   - API Key
   - API Secret

### Variables de entorno

```
CLOUDINARY_CLOUD_NAME=<TU_CLOUD_NAME>
CLOUDINARY_API_KEY=<TU_API_KEY>
CLOUDINARY_API_SECRET=<TU_API_SECRET>
```

### Codigo de configuracion (lib/cloudinary.js)

```javascript
import {v2 as cloudinary} from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
```

### Uso de Cloudinary en el proyecto

#### Subir imagen:

```javascript
const cloudinaryResponse = await cloudinary.uploader.upload(image, {folder: "products"});
```

- `image`: La imagen en formato base64
- `folder`: Carpeta donde se guardara en Cloudinary
- Devuelve un objeto con `secure_url` (la URL de la imagen)

#### Eliminar imagen:

```javascript
const publicId = product.image.split("/").pop().split(".")[0];
await cloudinary.uploader.destroy(`products/${publicId}`);
```

- Extrae el ID publico de la URL
- Elimina la imagen de Cloudinary

---

## 4. Stripe

### Que es Stripe

Stripe es una plataforma de pagos que permite:

- Procesar pagos con tarjeta de credito
- Gestionar suscripciones
- Manejar multiples monedas
- Cumplir con regulaciones de seguridad (PCI-DSS)

### Por que usar Stripe

- Es el estandar de la industria para pagos online
- Maneja la seguridad de los datos de tarjeta
- Proporciona un checkout personalizable
- Tiene un modo de prueba (test mode) para desarrollo

### Como configurar Stripe

1. Ir a https://stripe.com
2. Crear una cuenta
3. En el dashboard, asegurarse de estar en "Test mode"
4. Ir a Developers > API Keys
5. Copiar la Secret Key y la Publishable Key

### Variables de entorno

```
STRIPE_SECRET_KEY=<TU_STRIPE_SECRET_KEY>
STRIPE_PUBLISHABLE_KEY=<TU_STRIPE_PUBLISHABLE_KEY>
```

### Codigo de configuracion (lib/stripe.js)

```javascript
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
```

### Flujo de pago con Stripe Checkout

1. El usuario hace clic en "Proceder al pago"
2. El frontend envia los productos al backend
3. El backend crea una sesion de Stripe Checkout
4. El backend devuelve la URL de la sesion
5. El frontend redirige al usuario a Stripe
6. El usuario ingresa los datos de pago en Stripe
7. Stripe procesa el pago
8. Stripe redirige al usuario a success_url o cancel_url

### Creacion de sesion de Checkout (payment.controller.js)

```javascript
export const createCheckoutSession = async (req, res) => {
    try {
        const { products, couponCode } = req.body;

        let totalAmount = 0;

        const lineItems = products.map((product) => {
            const amount = Math.round(product.price * 100); // Stripe usa centavos
            totalAmount += amount * product.quantity;

            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: product.name,
                        images: [product.image],
                    },
                    unit_amount: amount,
                },
                quantity: product.quantity || 1,
            };
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
            metadata: {
                userId: req.user._id.toString(),
                couponCode: couponCode || "",
                products: JSON.stringify(
                    products.map((p) => ({
                        id: p._id,
                        quantity: p.quantity,
                        price: p.price,
                    }))
                ),
            },
        });

        res.status(200).json({ id: session.id, url: session.url });
    } catch (error) {
        console.error("Error processing checkout:", error);
        res.status(500).json({ message: "Error processing checkout" });
    }
};
```

### Explicacion del codigo:

- **lineItems**: Lista de productos en el formato que Stripe espera
- **unit_amount**: Precio en centavos (Stripe no acepta decimales)
- **success_url**: URL donde redirige si el pago es exitoso
- **cancel_url**: URL donde redirige si el usuario cancela
- **metadata**: Datos adicionales que Stripe guarda y devuelve

### Tarjetas de prueba

En modo test, Stripe proporciona tarjetas de prueba:

| Numero de tarjeta | Descripcion |
|-------------------|-------------|
| 4242 4242 4242 4242 | Pago exitoso |
| 4000 0000 0000 0002 | Tarjeta rechazada |
| 4000 0025 0000 3155 | Requiere autenticacion |

Usar cualquier fecha futura y cualquier CVC de 3 digitos.

---

## 5. Variables de Entorno

### Archivo .env

El archivo `.env` almacena configuraciones sensibles que no deben subirse al repositorio. Debe crearse en la raiz del proyecto:

```
# Puerto del servidor
PORT=4000

# MongoDB
MONGO_URI=<TU_URI_DE_MONGODB>

# Redis
UPSTASH_REDIS_URL=<TU_URL_DE_REDIS>

# JWT
ACCESS_TOKEN_SECRET=<TU_CLAVE_SECRETA>
REFRESH_TOKEN_SECRET=<TU_CLAVE_SECRETA>

# Cloudinary
CLOUDINARY_CLOUD_NAME=<TU_CLOUD_NAME>
CLOUDINARY_API_KEY=<TU_API_KEY>
CLOUDINARY_API_SECRET=<TU_API_SECRET>

# Stripe
STRIPE_SECRET_KEY=<TU_STRIPE_SECRET_KEY>
STRIPE_PUBLISHABLE_KEY=<TU_STRIPE_PUBLISHABLE_KEY>

# Cliente
CLIENT_URL=http://localhost:5175

# Entorno
NODE_ENV=development
```

### Importante sobre seguridad

- **NUNCA** subir el archivo `.env` a GitHub
- Agregar `.env` al archivo `.gitignore`
- Cada desarrollador debe crear su propio archivo `.env`
- En produccion, usar variables de entorno del servidor
