import { AppProps } from 'next/app'
import "../styles/index.css"
import "font-awesome/css/font-awesome.min.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
