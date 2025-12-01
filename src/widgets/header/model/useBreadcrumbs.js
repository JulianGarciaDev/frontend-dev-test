import { useLocation } from "react-router-dom";

export function useBreadcrumbs() {
  const location = useLocation();
  
  const paths = location.pathname.split('/').filter(Boolean);
  
  const breadcrumbs = [{ name: 'Inicio', path: '/' }];
  
  if (paths[0] === 'product' && paths[1]) {
    breadcrumbs.push({ 
      name: 'Detalles del producto', 
      path: location.pathname 
    });
  }

  return breadcrumbs;
}
