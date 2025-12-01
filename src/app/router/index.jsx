import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProductListPage } from "@/pages/product-list";
import { ProductDetailsPage } from "@/pages/product-details";
import { Header } from "@/widgets/header";

export function Router() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<ProductListPage />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
