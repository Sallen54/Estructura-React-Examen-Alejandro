import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {Router, createBrowserRouter} from "react-router-dom";
import{RouterProvider} from 'react-router'
import Router from './Router';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={Router}/>

  </StrictMode>,
)
