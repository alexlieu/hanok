import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ProductsPage, { loader as productsLoader } from './pages/Products';
import ProductPage, { loader as productLoader } from './pages/Product';
import './App.css';
import RootLayout from './pages/Root';
import HomePage from './pages/Home';
import ErrorPage from './pages/Error';

const router = createBrowserRouter([
  { 
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {index: true, element: < HomePage />},
      {
        path: 'products', 
        children: [
          {index: true, element: < ProductsPage />, loader: productsLoader,},
          {path: ':id', element: < ProductPage />, loader: productLoader},
        ]
      },
    ],
  },
]);

function App() { return <RouterProvider router={router} />; }

export default App
