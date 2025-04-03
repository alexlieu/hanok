import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ProductsPage from './pages/Products';
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
      {path: 'products', element: < ProductsPage />},
    ],
  },
]);

function App() { return <RouterProvider router={router} />; }

export default App
