import { useState } from "react";
import { AddToCart } from "@/features/cart";
import "./ProductActions.css";

export function ProductActions({ product }) {
  const hasColors = product?.options?.colors?.length > 0;
  const hasStorages = product?.options?.storages?.length > 0;

  const [color, setColor] = useState(() => 
    hasColors ? product.options.colors[0] : null
  );
  const [storage, setStorage] = useState(() => 
    hasStorages ? product.options.storages[0] : null
  );

  return (
    <div className="product-actions">
      <h2>Configuración</h2>
      
      {(hasColors || hasStorages) ? (
        <div className="product-actions__options">
          {hasColors && (
            <div className="product-actions__option">
              <label>Color</label>
              <select
                value={color?.code || ''}
                onChange={e => {
                  const selected = product.options.colors.find(
                    c => c.code === parseInt(e.target.value)
                  );
                  setColor(selected);
                }}
              >
                {product.options.colors.map(c => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          {hasStorages && (
            <div className="product-actions__option">
              <label>Almacenamiento</label>
              <select
                value={storage?.code || ''}
                onChange={e => {
                  const selected = product.options.storages.find(
                    s => s.code === parseInt(e.target.value)
                  );
                  setStorage(selected);
                }}
              >
                {product.options.storages.map(s => (
                  <option key={s.code} value={s.code}>{s.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      ) : (
        <p className="product-actions__no-options">Sin opciones de configuración</p>
      )}

      <AddToCart 
        product={product} 
        colorCode={color?.code || 0} 
        storageCode={storage?.code || 0}
      />
    </div>
  );
}