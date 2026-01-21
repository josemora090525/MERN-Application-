# MERN Application - Documentacion Completa

## Indice General

1. Introduccion
2. Que es una aplicacion MERN
3. Estructura del proyecto
4. Backend - Servidor y API
5. Frontend - Interfaz de usuario
6. Servicios externos
7. Guia de instalacion y configuracion

---

## 1. Introduccion

Este proyecto es una aplicacion de comercio electronico (e-commerce) completa desarrollada utilizando el stack MERN. La aplicacion permite a los usuarios:

- Registrarse e iniciar sesion
- Ver productos organizados por categorias
- Agregar productos al carrito de compras
- Aplicar cupones de descuento
- Realizar pagos con tarjeta de credito
- Ver historial de compras

Ademas, cuenta con un panel de administracion donde los administradores pueden:

- Crear, editar y eliminar productos
- Marcar productos como destacados
- Ver estadisticas de ventas y usuarios

---

## 2. Que es MERN

MERN es un acronimo que representa un conjunto de cuatro tecnologias utilizadas para desarrollar aplicaciones web completas:

### M - MongoDB

MongoDB es una base de datos NoSQL (No relacional) que almacena datos en formato JSON (JavaScript Object Notation). A diferencia de las bases de datos tradicionales que usan tablas y filas, MongoDB utiliza "documentos" y "colecciones".

Ejemplo de un documento en MongoDB:
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Camiseta Negra",
  "price": 29.99,
  "category": "ropa",
  "isFeatured": true
}
```

Ventajas:
- Flexibilidad en la estructura de datos
- Escalabilidad horizontal
- Alto rendimiento para operaciones de lectura

### E - Express.js

Express.js es un framework minimalista para Node.js que facilita la creacion de servidores web y APIs. Proporciona herramientas para:

- Definir rutas (URLs) que la aplicacion puede manejar
- Procesar peticiones HTTP (GET, POST, PUT, DELETE)
- Implementar middleware (funciones que se ejecutan entre la peticion y la respuesta)

### R - React

React es una biblioteca de JavaScript desarrollada por Facebook para construir interfaces de usuario. Sus caracteristicas principales son:

- Componentes: La interfaz se divide en piezas reutilizables
- Estado: Cada componente puede tener datos que cambian con el tiempo
- Virtual DOM: Optimiza las actualizaciones de la interfaz

### N - Node.js

Node.js es un entorno de ejecucion que permite ejecutar JavaScript fuera del navegador, especificamente en el servidor. Esto permite usar el mismo lenguaje (JavaScript) tanto en el frontend como en el backend.

---

## 3. Que es una API

API significa "Application Programming Interface" (Interfaz de Programacion de Aplicaciones). En el contexto de aplicaciones web, una API es un conjunto de reglas y endpoints (puntos de acceso) que permiten que diferentes programas se comuniquen entre si.

### Como funciona una API REST

REST (Representational State Transfer) es un estilo de arquitectura para disenar APIs. Las APIs REST utilizan los metodos HTTP estandar:

| Metodo | Descripcion | Ejemplo |
|--------|-------------|---------|
| GET | Obtener datos | Obtener lista de productos |
| POST | Crear nuevos datos | Crear un nuevo usuario |
| PUT/PATCH | Actualizar datos existentes | Actualizar precio de producto |
| DELETE | Eliminar datos | Eliminar un producto |

### Ejemplo practico

Cuando un usuario quiere ver todos los productos:

1. El frontend (React) hace una peticion GET a `/api/products`
2. El backend (Express) recibe la peticion
3. El backend consulta la base de datos (MongoDB)
4. El backend responde con los datos en formato JSON
5. El frontend muestra los productos en pantalla

```
Frontend (React)  ---->  Backend (Express)  ---->  Base de datos (MongoDB)
     |                          |                          |
     |    GET /api/products     |      Consulta datos      |
     |------------------------->|------------------------->|
     |                          |                          |
     |    [lista de productos]  |    [lista de productos]  |
     |<-------------------------|<-------------------------|
```

---

## 4. HTTP y Codigos de Estado

HTTP (HyperText Transfer Protocol) es el protocolo que usan los navegadores y servidores para comunicarse. Cada respuesta HTTP incluye un codigo de estado:

### Codigos comunes en este proyecto

| Codigo | Significado | Uso en el proyecto |
|--------|-------------|-------------------|
| 200 | OK | Operacion exitosa |
| 201 | Created | Recurso creado exitosamente |
| 400 | Bad Request | Datos de entrada invalidos |
| 401 | Unauthorized | No autenticado |
| 403 | Forbidden | Sin permisos |
| 404 | Not Found | Recurso no encontrado |
| 500 | Internal Server Error | Error del servidor |

---

## 5. JSON Web Tokens (JWT)

JWT es un estandar para crear tokens de acceso que permiten verificar la identidad de un usuario. En este proyecto se usan dos tipos de tokens:

### Access Token
- Duracion corta (15 minutos)
- Se usa para autenticar cada peticion
- Se almacena en una cookie HttpOnly

### Refresh Token
- Duracion larga (7 dias)
- Se usa para obtener nuevos Access Tokens
- Se almacena en Redis para poder invalidarlo

El flujo de autenticacion es:

1. Usuario inicia sesion con email y contrasena
2. El servidor verifica las credenciales
3. El servidor genera un Access Token y un Refresh Token
4. Los tokens se envian al navegador como cookies
5. Cada peticion incluye automaticamente el Access Token
6. Cuando el Access Token expira, se usa el Refresh Token para obtener uno nuevo

---

## 6. Cookies y Seguridad

Las cookies son pequenos fragmentos de datos que el servidor envia al navegador y que este almacena localmente. Este proyecto utiliza cookies seguras con las siguientes configuraciones:

- **httpOnly**: La cookie no es accesible desde JavaScript, previniendo ataques XSS (Cross-Site Scripting)
- **secure**: La cookie solo se envia sobre conexiones HTTPS (en produccion)
- **sameSite: strict**: La cookie solo se envia en peticiones del mismo sitio, previniendo ataques CSRF (Cross-Site Request Forgery)

---

## 7. Middleware

En Express, un middleware es una funcion que se ejecuta entre la recepcion de una peticion y el envio de la respuesta. Los middleware pueden:

- Verificar autenticacion
- Validar datos
- Registrar logs
- Modificar la peticion o respuesta

En este proyecto, los middleware principales son:

- **protectRoute**: Verifica que el usuario este autenticado
- **adminRoute**: Verifica que el usuario sea administrador
