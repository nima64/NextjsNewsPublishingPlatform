import { AppProps } from 'next/app'
import "../styles/index.css"
import "font-awesome/css/font-awesome.min.css";
import Head from 'next/head';
export default function MyApp({ Component, pageProps }: AppProps) {
  return <>
  <Head>
    <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
  </Head>
  <Component {...pageProps} />
  </>
}
