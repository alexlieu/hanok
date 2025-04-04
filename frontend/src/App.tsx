import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ProductsPage from './pages/Products';
import './App.css';
import RootLayout from './pages/Root';
import HomePage from './pages/Home';
import ErrorPage from './pages/Error';
import ProductsTest, {productsLoader} from './pages/ProductsTest';

const router = createBrowserRouter([
  { 
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {index: true, element: < HomePage />,},
      {path: 'products', element: < ProductsPage />, },
      {path: 'test', element: <ProductsTest />, loader: productsLoader, },
    ],
  },
]);

function App() { return <RouterProvider router={router} />; }

export default App
// async () => {
//         const response = await fetch('http://localhost:8080/api/products');
//         if (!response.ok) throw new Error('Something went wrong.');
//         const products = await response.json();
//         return {products};
//       }