import React from 'react';
import { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import store from '../redux/store';
import Layout from '../components/Layout';
import '../styles/globals.css'; // Ensure to include your global styles

function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Layout>
        <div className="content-body">
        <Component {...pageProps} />
        </div>
      </Layout>
    </Provider>
  );
}

export default App;
