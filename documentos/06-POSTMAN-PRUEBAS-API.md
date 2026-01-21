# Postman - Pruebas de API

Este documento explica como usar Postman para probar la API del proyecto.

---

## 1. Que es Postman

Postman es una herramienta gratuita que permite enviar peticiones HTTP a una API y ver las respuestas. Es fundamental para:

- Probar endpoints antes de conectar el frontend
- Depurar errores en la API
- Documentar los endpoints
- Simular diferentes escenarios

---

## 2. Instalacion

1. Ir a https://www.postman.com/downloads/
2. Descargar la version para tu sistema operativo
3. Instalar y crear una cuenta gratuita (opcional pero recomendado)

---

## 3. Conceptos Basicos

### Peticion HTTP

Una peticion HTTP consta de:

- **Metodo**: GET, POST, PUT, PATCH, DELETE
- **URL**: Direccion del endpoint
- **Headers**: Metadatos de la peticion (Content-Type, Authorization, etc.)
- **Body**: Datos enviados (solo en POST, PUT, PATCH)

### Respuesta HTTP

Una respuesta HTTP incluye:

- **Status Code**: Codigo numerico (200, 404, 500, etc.)
- **Headers**: Metadatos de la respuesta
- **Body**: Datos devueltos (generalmente en JSON)

---

## 4. Configuracion del Entorno

En Postman, crear un "Environment" con las siguientes variables:

| Variable | Valor |
|----------|-------|
| baseUrl | http://localhost:4000/api |

Esto permite usar `{{baseUrl}}` en las URLs para cambiar facilmente entre desarrollo y produccion.

---

## 5. Endpoints de Autenticacion

### POST - Registro de Usuario

**URL**: `{{baseUrl}}/auth/signup`

**Headers**:
```
Content-Type: application/json
```

**Body** (raw JSON):
```json
{
    "name": "Juan Perez",
    "email": "juan@ejemplo.com",
    "password": "123456"
}
```

**Respuesta exitosa** (201):
```json
{
    "_id": "507f1f77bcf86cd799439011",
    "name": "Juan Perez",
    "email": "juan@ejemplo.com",
    "role": "customer"
}
```

**Respuesta de error** (400):
```json
{
    "message": "User already exists"
}
```

### POST - Inicio de Sesion

**URL**: `{{baseUrl}}/auth/login`

**Headers**:
```
Content-Type: application/json
```

**Body**:
```json
{
    "email": "juan@ejemplo.com",
    "password": "123456"
}
```

**Respuesta exitosa** (200):
```json
{
    "_id": "507f1f77bcf86cd799439011",
    "name": "Juan Perez",
    "email": "juan@ejemplo.com",
    "role": "customer"
}
```

**Nota**: Esta peticion devuelve cookies (accessToken y refreshToken). Postman las almacena automaticamente.

### POST - Cerrar Sesion

**URL**: `{{baseUrl}}/auth/logout`

**Respuesta exitosa** (200):
```json
{
    "message": "Logged out successfully"
}
```

### GET - Obtener Perfil

**URL**: `{{baseUrl}}/auth/profile`

**Requisito**: Estar autenticado (haber hecho login previamente)

**Respuesta exitosa** (200):
```json
{
    "_id": "507f1f77bcf86cd799439011",
    "name": "Juan Perez",
    "email": "juan@ejemplo.com",
    "role": "customer",
    "cartItems": []
}
```

### POST - Refrescar Token

**URL**: `{{baseUrl}}/auth/refresh-token`

**Requisito**: Tener un refreshToken valido en las cookies

**Respuesta exitosa** (200):
```json
{
    "message": "Token refreshed successfully"
}
```

---

## 6. Endpoints de Productos

### GET - Productos Destacados

**URL**: `{{baseUrl}}/products/featured`

**Autenticacion**: No requerida

**Respuesta** (200):
```json
[
    {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Camiseta Negra",
        "description": "Camiseta de algodon 100%",
        "price": 29.99,
        "image": "https://res.cloudinary.com/xxx/image/upload/xxx.jpg",
        "category": "clothing",
        "isFeatured": true
    }
]
```

### GET - Productos por Categoria

**URL**: `{{baseUrl}}/products/category/clothing`

**Autenticacion**: No requerida

**Respuesta** (200):
```json
{
    "products": [
        {
            "_id": "507f1f77bcf86cd799439011",
            "name": "Camiseta Negra",
            "description": "Camiseta de algodon",
            "price": 29.99,
            "image": "https://...",
            "category": "clothing"
        }
    ]
}
```

### GET - Productos Recomendados

**URL**: `{{baseUrl}}/products/recommendations`

**Autenticacion**: No requerida

Devuelve 4 productos aleatorios.

### GET - Todos los Productos (Admin)

**URL**: `{{baseUrl}}/products`

**Autenticacion**: Requerida (Admin)

**Respuesta** (200):
```json
{
    "products": [...]
}
```

### POST - Crear Producto (Admin)

**URL**: `{{baseUrl}}/products`

**Autenticacion**: Requerida (Admin)

**Headers**:
```
Content-Type: application/json
```

**Body**:
```json
{
    "name": "Nuevo Producto",
    "description": "Descripcion del producto",
    "price": 49.99,
    "category": "electronics",
    "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUg..."
}
```

**Nota**: La imagen debe enviarse en formato base64.

**Respuesta** (201):
```json
{
    "_id": "507f1f77bcf86cd799439012",
    "name": "Nuevo Producto",
    "description": "Descripcion del producto",
    "price": 49.99,
    "category": "electronics",
    "image": "https://res.cloudinary.com/xxx/image/upload/xxx.jpg",
    "isFeatured": false
}
```

### DELETE - Eliminar Producto (Admin)

**URL**: `{{baseUrl}}/products/507f1f77bcf86cd799439012`

**Autenticacion**: Requerida (Admin)

**Respuesta** (200):
```json
{
    "message": "Product deleted successfully"
}
```

### PATCH - Toggle Destacado (Admin)

**URL**: `{{baseUrl}}/products/507f1f77bcf86cd799439012`

**Autenticacion**: Requerida (Admin)

Cambia el estado de `isFeatured` entre true y false.

---

## 7. Endpoints del Carrito

### GET - Obtener Carrito

**URL**: `{{baseUrl}}/cart`

**Autenticacion**: Requerida

**Respuesta** (200):
```json
[
    {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Camiseta Negra",
        "price": 29.99,
        "image": "https://...",
        "quantity": 2
    }
]
```

### POST - Agregar al Carrito

**URL**: `{{baseUrl}}/cart`

**Autenticacion**: Requerida

**Body**:
```json
{
    "productId": "507f1f77bcf86cd799439011"
}
```

**Respuesta** (200):
```json
[...]  // Carrito actualizado
```

### PUT - Actualizar Cantidad

**URL**: `{{baseUrl}}/cart/507f1f77bcf86cd799439011`

**Autenticacion**: Requerida

**Body**:
```json
{
    "quantity": 3
}
```

### DELETE - Eliminar del Carrito

**URL**: `{{baseUrl}}/cart`

**Autenticacion**: Requerida

**Body**:
```json
{
    "productId": "507f1f77bcf86cd799439011"
}
```

---

## 8. Endpoints de Cupones

### GET - Obtener Mi Cupon

**URL**: `{{baseUrl}}/coupons`

**Autenticacion**: Requerida

**Respuesta** (200):
```json
{
    "code": "GIFT10",
    "discountPercentage": 10,
    "expirationDate": "2024-12-31T00:00:00.000Z",
    "isActive": true
}
```

### POST - Validar Cupon

**URL**: `{{baseUrl}}/coupons/validate`

**Autenticacion**: Requerida

**Body**:
```json
{
    "code": "GIFT10"
}
```

---

## 9. Endpoints de Pago

### POST - Crear Sesion de Checkout

**URL**: `{{baseUrl}}/payments/create-checkout-session`

**Autenticacion**: Requerida

**Body**:
```json
{
    "products": [
        {
            "_id": "507f1f77bcf86cd799439011",
            "name": "Camiseta Negra",
            "price": 29.99,
            "image": "https://...",
            "quantity": 2
        }
    ],
    "couponCode": "GIFT10"
}
```

**Respuesta** (200):
```json
{
    "id": "cs_test_xxxx",
    "url": "https://checkout.stripe.com/pay/cs_test_xxxx",
    "totalAmount": 53.98
}
```

### POST - Confirmar Compra Exitosa

**URL**: `{{baseUrl}}/payments/checkout-success`

**Autenticacion**: Requerida

**Body**:
```json
{
    "sessionId": "cs_test_xxxx"
}
```

---

## 10. Endpoints de Analytics (Admin)

### GET - Obtener Estadisticas

**URL**: `{{baseUrl}}/analytics`

**Autenticacion**: Requerida (Admin)

**Respuesta** (200):
```json
{
    "analyticsData": {
        "users": 150,
        "products": 45,
        "totalSales": 523,
        "totalRevenue": 15234.50
    },
    "dailySalesData": [
        {
            "date": "2024-01-15",
            "sales": 12,
            "revenue": 456.78
        }
    ]
}
```

---

## 11. Consejos para Usar Postman

### Organizar en Colecciones

Crear una coleccion "MERN E-Commerce" y organizar las peticiones en carpetas:
- Auth
- Products
- Cart
- Coupons
- Payments
- Analytics

### Guardar Ejemplos

Para cada peticion, guardar ejemplos de respuestas exitosas y de error.

### Usar Variables

Guardar el ID de un producto creado en una variable para usarlo en otras peticiones:
```
pm.environment.set("productId", pm.response.json()._id);
```

### Tests Automatizados

Agregar tests para verificar las respuestas:
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has products", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.products).to.be.an('array');
});
```

### Manejo de Cookies

Postman maneja las cookies automaticamente. Despues de hacer login, las cookies se enviaran en todas las peticiones siguientes al mismo dominio.

Para ver las cookies actuales: Menu superior > Cookies

### Modo Bulk Edit

Para agregar multiples headers rapidamente, usar el modo "Bulk Edit":
```
Content-Type:application/json
Authorization:Bearer {{token}}
```
