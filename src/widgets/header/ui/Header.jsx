import { Link } from "react-router-dom";
import { CartBadge } from "@/features/cart";
import { useBreadcrumbs } from "../model/useBreadcrumbs";
import "./Header.css";

export function Header() {
  const breadcrumbs = useBreadcrumbs();

  return (
    <header className="header">
      <div className="header__container">
        <Link to="/" className="header__logo">
          <span>Mobitx Store</span>
        </Link>

        <nav className="header__breadcrumbs" aria-label="breadcrumb">
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb.path} className="breadcrumb-item">
              {index > 0 && <span className="breadcrumb-separator">/</span>}
              {index === breadcrumbs.length - 1 ? (
                <span className="breadcrumb-current">{crumb.name}</span>
              ) : (
                <Link to={crumb.path} className="breadcrumb-link">
                  {crumb.name}
                </Link>
              )}
            </span>
          ))}
        </nav>

        <CartBadge />
      </div>
    </header>
  );
}
