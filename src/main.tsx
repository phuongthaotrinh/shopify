
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {AppProvider} from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import {Toaster} from "react-hot-toast";


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <AppProvider i18n={enTranslations}>
            <App />
          <Toaster />
      </AppProvider>,
  </React.StrictMode>,
)
