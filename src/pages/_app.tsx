import React, { useEffect, useState } from 'react'
import { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import store from '../redux/store'
import Layout from '../components/Layout'
import '../styles/globals.css' // Ensure to include your global styles
import { Auth0Provider } from '@auth0/auth0-react'
import { auth0Config } from '@/config/auth0'
import { ThemeProvider } from "@material-tailwind/react";
function App({ Component, pageProps }: AppProps) {

  return (
    <Auth0Provider
      domain={auth0Config.domain}
      clientId={auth0Config.clientId}
      authorizationParams={{
        redirect_uri: auth0Config.redirect_uri,
      }}
    >
      <Provider store={store}>
        <ThemeProvider>
          <Layout>
		  
            <div className="content-body">
              <Component {...pageProps} />
            </div>
          </Layout>
        </ThemeProvider>
      </Provider>
    </Auth0Provider>
  )
}

export default App
