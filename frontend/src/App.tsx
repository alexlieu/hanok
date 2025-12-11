import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { BasketProvider } from "./store/BasketProvider";
import ProductsPage from "./pages/Products";
import ProductPage from "./pages/Product";
import RootLayout from "./pages/Root";
import HomePage from "./pages/Home";
import ErrorPage from "./pages/Error";
import {
  productsLoader,
  productsByCategoryLoader,
  productLoader,
  basketLoader,
  checkoutLoader,
} from "./utils/loader";
import "./App.css";
import BasketPage from "./pages/Basket";
import CheckoutPage from "./pages/Checkout";
import ProductsSkeleton from "./components/ui/skeletons/ProductsSkeleton";
import ProductDetailSkeleton from "./components/ui/skeletons/ProductDetailSkeleton";
import BasketSkeleton from "./components/ui/skeletons/BasketSkeleton";
import CheckoutSkeleton from "./components/ui/skeletons/CheckoutSkeleton";
import OrderConfirmationPage from "./pages/OrderConfirmation";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "products",
        id: "all-products",
        loader: productsLoader,
        HydrateFallback: ProductsSkeleton,
        children: [
          {
            index: true,
            element: <ProductsPage />,
          },
          {
            path: ":categorySlug",
            element: <ProductsPage />,
            loader: productsByCategoryLoader,
            HydrateFallback: ProductsSkeleton,
          },
          {
            path: ":categorySlug/:productSlug",
            element: <ProductPage />,
            loader: productLoader,
            HydrateFallback: ProductDetailSkeleton,
          },
        ],
      },
      {
        path: "basket",
        element: <BasketPage />,
        loader: basketLoader,
        HydrateFallback: BasketSkeleton,
      },
      {
        path: "checkout",
        element: <CheckoutPage />,
        loader: checkoutLoader,
        HydrateFallback: CheckoutSkeleton,
      },
      {
        path: "order-confirmation",
        element: <OrderConfirmationPage />,
      },
    ],
  },
]);

function App() {
  return (
    <BasketProvider>
      <RouterProvider router={router} />
    </BasketProvider>
  );
}

export default App;
