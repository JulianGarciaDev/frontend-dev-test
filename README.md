# Mobile Store

Aplicación web de tienda de móviles desarrollada con React y JavaScript ES6, utilizando **Feature-Sliced Design (FSD)** como arquitectura.

## Características

- **Búsqueda en tiempo real** por marca o modelo
- **Página de detalle** del producto con especificaciones técnicas completas
- **Carrito** con contador persistente
- **Sistema de caché** de productos con expiración de 1 hora para optimizar peticiones al API
- **Breadcrumbs** para navegación intuitiva
- **Diseño responsive** adaptado a móviles, tablets y desktop con grid de máximo 4 columnas

## Requisitos

- Node.js (versión 16 o superior)
- npm o yarn

## Instalación

1. Instala las dependencias:
```bash
npm install
```

2. Inicia el servidor de desarrollo:
```bash
npm run start
```

3. URL: `http://localhost:5173`

## Scripts disponibles

- `npm run start` - Inicia el servidor de desarrollo
- `npm run build` - Genera la build de producción
- `npm run test` - Ejecuta los tests con Vitest
- `npm run test:ui` - Tests con interfaz visual
- `npm run lint` - Comprobación de código

## API

La aplicación consume el API de prueba:
- **Base URL:** `https://itx-frontend-test.onrender.com/api`
- **Endpoints:**
  - `GET /product` - Lista de productos
  - `GET /product/:id` - Detalle de producto
  - `POST /cart` - Añadir al carrito

## Sistema de Caché

- Los productos se almacenan en `localStorage`
- **Duración:** 1 hora
- **Beneficios:** Reduce peticiones al servidor y mejora rendimiento

## Tecnologías utilizadas

- **React 19** - Librería UI
- **React Router DOM** - Enrutamiento
- **Vite** - Build tool y dev server
- **CSS** - Estilos por componente
- **Context API** - Gestión de estado global
- **Feature-Sliced Design** - Arquitectura

## Decisiones de arquitectura

### Capas (de más específica a más general):

1. **`app/`** - Inicialización de la aplicación
   - Configuración de providers (CartProvider)
   - Definición de rutas (React Router)

2. **`pages/`** - Páginas completas
   - `product-list` - Listado con búsqueda
   - `product-details` - Detalle y opciones de compra

3. **`widgets/`** - Componentes complejos reutilizables
   - `header` - Navegación, breadcrumbs y carrito

4. **`features/`** - Funcionalidades de negocio
   - `cart` - Añadir al carrito, contador persistente
   - `product-search` - Búsqueda en tiempo real

5. **`entities/`** - Entidades de dominio
   - `product` - Datos, hooks y componentes

6. **`shared/`** - Infraestructura compartida
   - `api` - Cliente HTTP y sistema de caché
   - `ui` - Componentes base

### React Router (Component-based)

Se optó por usar el router tradicional con `<Link>` y hooks (`useParams`) en lugar del nuevo Data Router por:

- **Simplicidad:** Solo 2 rutas, no justifica la complejidad de loaders
- **Cohesión:** Los hooks de fetching (`useProducts`, `useProduct`) viven cerca de los componentes
- **Caché personalizado:** El sistema de localStorage se integra naturalmente con hooks
- **Navegación declarativa:** Uso de `<Link to="/">` en vez de navegación imperativa

**Nota:** Para aplicaciones más grandes con SSR o streaming, el Data Router sería la opción recomendada.

### Path Aliases

El proyecto usa path aliases (`@/`) configurados en `vite.config.js`.

## Problemas conocidos

### Contador del Carrito

El endpoint `POST /cart` del API siempre devuelve `{ count: 1 }` independientemente del número total de productos en el carrito. 

**Comportamiento esperado:**
```
// Primera vez
POST /cart → { "count": 1 }

// Segunda vez (debería devolver 2)
POST /cart → { "count": 2 }
```

**Comportamiento actual:**
```
// Siempre devuelve 1
POST /cart → { "count": 1 }
POST /cart → { "count": 1 }
POST /cart → { "count": 1 }
```

**Solución implementada:**

Para mantener el contador correcto, la aplicación:

1. Mantiene el contador en `localStorage`
2. Al añadir un producto, solo se tiene en cuenta el contador local
3. Persiste el resultado actualizado

Esta solución funciona correctamente para el propósito de la aplicación, aunque idealmente el API debería devolver el contador total real del carrito del usuario.

## Posibles mejoras

- **Ordenamiento** de los productos por precio, marca, modelo, etc.
- **Paginación** o scroll infinito en listado
- **Filtros** por marca, precio, especificaciones...
- **TanStack Query** para gestión de estado servidor y caché
- **Breadcrumbs más detallados** (categoría → marca → producto)
- **Modo oscuro**
- **Textos alternativos** descriptivos en imágenes
- **Contraste de colores** WCAG AA compliant
- **i18n** multi-idioma (español, inglés, etc.)
- **Formateo de monedas** según región
- **Captura de errores HTTP y respuestas vacías** al llamar a la API externa: reintentos, mensajes para el usuario, etc.
- **Error boundaries** en React para errores de rendering
- **Logging estructurado** para debugging

## Testing pendiente

#### Unit Test importantes
- `useSearch.js` - Hook de búsqueda con debounce
- `CartProvider.jsx` - Lógica del carrito y localStorage
- `useCart.js` - Hook de consumo del contexto

#### Component Test importantes
- `ProductActions.component.test.jsx` - Selectores + AddToCart + validación de precio
- `SearchBar.component.test.jsx` - Input + useSearch con debounce real
- `Header.component.test.jsx` - CartBadge + Breadcrumbs + navegación

#### End-to-End Tests importantes
- Flujo completo: Home → Buscar → Ver detalle → Añadir al carrito
- Navegación: Logo, breadcrumbs, back/forward del navegador
- Persistencia: Carrito sobrevive a refresh de página
- Búsqueda: Filtrado en tiempo real
- Validación: Producto sin precio no permite añadir al carrito
- Errores: API fallida muestra mensaje al usuario
