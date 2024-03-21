
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {AppProvider} from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <AppProvider i18n={enTranslations}>
            <App />
      </AppProvider>,
  </React.StrictMode>,
)
