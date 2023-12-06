import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { makeStyles } from '@mui/material'
import { ThemeProvider } from '@emotion/react'

const routes = createBrowserRouter([
  {
    path: '/',
    element: (<App/>)
  }
])


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={routes} />
  </React.StrictMode>,
)
