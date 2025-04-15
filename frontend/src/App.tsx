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
} from "./utils/loader";
import "./App.css";
import BasketPage from "./pages/Basket";

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
        children: [
          {
            index: true,
            element: <ProductsPage />,
          },
          {
            path: ":categorySlug",
            element: <ProductsPage />,
            loader: productsByCategoryLoader,
          },
          {
            path: ":categorySlug/:productSlug",
            element: <ProductPage />,
            loader: productLoader,
          },
        ],
      },
      { path: "basket", element: <BasketPage /> },
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
