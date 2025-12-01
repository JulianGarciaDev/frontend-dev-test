# Feature-Sliced Design Architecture

Este documento explica la arquitectura **Feature-Sliced Design (FSD)** implementada en este proyecto.

## 📚 ¿Qué es Feature-Sliced Design?

FSD es una metodología de arquitectura frontend que organiza el código en **capas** y **slices** (porciones), promoviendo:

- Separación clara de responsabilidades
- Escalabilidad del proyecto
- Reutilización de código
- Facilidad de mantenimiento
- Onboarding más rápido para nuevos desarrolladores

## 🎯 Capas del Proyecto

### 1. **App** (`src/app/`)

Capa de inicialización de la aplicación.

```
app/
├── providers/   # Providers globales (Context API)
│   └── index.jsx
└── router/      # Configuración de rutas
    └── index.jsx
```

**Responsabilidad:** Configurar providers, routing y otros aspectos globales.

**Ejemplo:**
```javascript
// app/providers/index.jsx
import { CartProvider } from "@/features/cart";

export function Providers({ children }) {
  return <CartProvider>{children}</CartProvider>;
}
```

---

### 2. **Pages** (`src/pages/`)

Páginas completas de la aplicación. Cada página compone widgets, features y entities.

```
pages/
├── product-list/
│   ├── ui/
│   │   ├── ProductListPage.jsx
│   │   └── ProductListPage.css
│   └── index.js
└── product-details/
    ├── ui/
    │   ├── ProductDetailsPage.jsx
    │   └── ProductDetailsPage.css
    └── index.js
```

**Responsabilidad:** Componer las features y entities para formar páginas completas.

**Ejemplo:**
```javascript
// pages/product-list/ui/ProductListPage.jsx
import { useProducts, ProductCard, ProductGrid } from "@/entities/product";
import { useSearch, SearchBar } from "@/features/product-search";

export function ProductListPage() {
  const { products, loading, error } = useProducts();
  const { query, setQuery, filtered } = useSearch(products, (p) => `${p.brand} ${p.model}`);
  
  return (
    <div>
      <SearchBar value={query} onChange={setQuery} />
      <ProductGrid products={filtered} renderProduct={(p) => <ProductCard product={p} />} />
    </div>
  );
}
```

---

### 3. **Widgets** (`src/widgets/`)

Componentes complejos e independientes que contienen lógica de negocio.

```
widgets/
└── header/
    ├── ui/
    │   ├── Header.jsx
    │   └── Header.css
    ├── model/
    │   └── useBreadcrumbs.js
    └── index.js
```

**Responsabilidad:** Componentes con lógica compleja que pueden usarse en múltiples páginas.

**Ejemplo:**
```javascript
// widgets/header/ui/Header.jsx
import { CartBadge } from "@/features/cart";
import { useBreadcrumbs } from "../model/useBreadcrumbs";

export function Header() {
  const breadcrumbs = useBreadcrumbs();
  return (
    <header>
      {/* Logo, breadcrumbs, CartBadge */}
    </header>
  );
}
```

---

### 4. **Features** (`src/features/`)

Funcionalidades de negocio específicas. Acciones que el usuario puede realizar.

```
features/
├── cart/
│   ├── model/
│   │   ├── CartContext.jsx
│   │   └── useCart.js
│   ├── ui/
│   │   ├── AddToCart/
│   │   └── CartBadge/
│   └── index.js
└── product-search/
    ├── model/
    │   └── useSearch.js
    ├── ui/
    │   ├── SearchBar.jsx
    │   └── SearchBar.css
    └── index.js
```

**Responsabilidad:** Implementar funcionalidades completas (añadir al carrito, buscar productos).

**Ejemplo:**
```javascript
// features/cart/ui/AddToCart/AddToCart.jsx
import { useCart } from "../../model/useCart";

export function AddToCart({ product }) {
  const { addToCart } = useCart();
  
  const handleAdd = () => {
    addToCart(product.id, colorCode, storageCode);
  };
  
  return <button onClick={handleAdd}>Añadir al carrito</button>;
}
```

---

### 5. **Entities** (`src/entities/`)

Entidades de dominio. Representan los objetos principales del negocio.

```
entities/
└── product/
    ├── api/
    │   └── productApi.js
    ├── model/
    │   └── useProducts.js
    ├── ui/
    │   ├── ProductCard/
    │   ├── ProductGrid/
    │   ├── ProductImage/
    │   └── ProductDetails/
    └── index.js
```

**Responsabilidad:** Definir la lógica, API y componentes relacionados con una entidad.

**Ejemplo:**
```javascript
// entities/product/api/productApi.js
import { fetchAPI } from "@/shared/api/base";
import { getCachedData, setCachedData } from "@/shared/api/cache";

export const productApi = {
  async getAll() {
    const cached = getCachedData("products");
    if (cached) return cached;
    
    const data = await fetchAPI("/product");
    setCachedData("products", data);
    return data;
  }
};
```

---

### 6. **Shared** (`src/shared/`)

Código compartido por toda la aplicación. Infraestructura reutilizable.

```
shared/
├── api/
│   ├── base.js    # Cliente HTTP
│   └── cache.js   # Sistema de caché
└── ui/
    └── Spinner/   # Componentes UI genéricos
```

**Responsabilidad:** Proveer utilidades, componentes base y funciones compartidas.

**Ejemplo:**
```javascript
// shared/api/base.js
export async function fetchAPI(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
}
```

---

## 📦 Public API (index.js)

Cada slice expone solo lo necesario mediante su `index.js`:

```javascript
// entities/product/index.js
export { productApi } from "./api/productApi";
export { useProducts, useProduct } from "./model/useProducts";
export { ProductCard } from "./ui/ProductCard/ProductCard";
export { ProductGrid } from "./ui/ProductGrid/ProductGrid";
export { ProductImage } from "./ui/ProductImage/ProductImage";
export { ProductDetails } from "./ui/ProductDetails/ProductDetails";
```

**Ventaja:** Controlas qué se exporta y simplificas los imports.

---

## 🔗 Reglas de Dependencias

### Jerarquía de Capas

```
app → pages → widgets → features → entities → shared
```

### Reglas:

✅ **Permitido:** Importar de capas inferiores  
❌ **Prohibido:** Importar de capas superiores  
❌ **Prohibido:** Importar entre slices del mismo nivel (cross-imports)

**Ejemplos:**

```javascript
// ✅ CORRECTO: Page importa de feature y entity
import { useProducts } from "@/entities/product";
import { SearchBar } from "@/features/product-search";

// ❌ INCORRECTO: Feature importa de page
import { ProductListPage } from "@/pages/product-list"; // ❌

// ❌ INCORRECTO: Entity importa de feature
import { useCart } from "@/features/cart"; // ❌
```

---

## 🛠️ Path Aliases

El proyecto usa **path aliases** configurados en `vite.config.js`:

```javascript
// Antes
import { ProductCard } from "../../../entities/product/ui/ProductCard/ProductCard";

// Después
import { ProductCard } from "@/entities/product";
```

**Ventajas:**
- Imports más limpios
- Fácil refactorización
- No depende de la ubicación relativa

---

## 🚀 Añadir una Nueva Feature

### Ejemplo: Feature "Favoritos"

1. **Crear la estructura:**

```
src/features/favorites/
├── model/
│   ├── FavoritesContext.jsx
│   └── useFavorites.js
├── ui/
│   ├── AddToFavorites/
│   │   ├── AddToFavorites.jsx
│   │   └── AddToFavorites.css
│   └── FavoritesList/
│       ├── FavoritesList.jsx
│       └── FavoritesList.css
└── index.js
```

2. **Implementar la lógica:**

```javascript
// features/favorites/model/useFavorites.js
export function useFavorites() {
  // Lógica de favoritos
}
```

3. **Exportar en index.js:**

```javascript
// features/favorites/index.js
export { useFavorites } from "./model/useFavorites";
export { AddToFavorites } from "./ui/AddToFavorites/AddToFavorites";
```

4. **Usar en pages:**

```javascript
// pages/product-details/ui/ProductDetailsPage.jsx
import { AddToFavorites } from "@/features/favorites";

export function ProductDetailsPage() {
  return (
    <div>
      {/* ... */}
      <AddToFavorites product={product} />
    </div>
  );
}
```

---

## 📖 Recursos Adicionales

- [Feature-Sliced Design Official](https://feature-sliced.design/)
- [FSD Examples](https://github.com/feature-sliced/examples)
- [Best Practices](https://feature-sliced.design/docs/guides/examples)

---

## ✅ Ventajas de FSD en Este Proyecto

1. **Escalabilidad:** Fácil añadir nuevas features sin tocar código existente
2. **Mantenibilidad:** Código organizado de forma predecible
3. **Reutilización:** Entities y shared son completamente reutilizables
4. **Testabilidad:** Cada slice es independiente y testeable
5. **Onboarding:** Nuevos desarrolladores entienden rápidamente la estructura
6. **Refactoring:** Cambios localizados, menor riesgo de romper otras partes

---

*Para más información sobre la implementación específica, consulta el código en cada directorio.*
