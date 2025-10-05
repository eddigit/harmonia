import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './pages/App'
import Upload from './pages/Upload'
import Intent from './pages/Intent'
import Customize from './pages/Customize'
import ExportPage from './pages/Export'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Upload /> },
      { path: '/intent', element: <Intent /> },
      { path: '/customize', element: <Customize /> },
      { path: '/export', element: <ExportPage /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
