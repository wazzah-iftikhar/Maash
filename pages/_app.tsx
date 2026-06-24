import type { AppProps } from 'next/app'
import Layout from '@/components/Layout'
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar'
import '@/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
      <ProgressBar height="3px" color="#C9A84C" options={{ showSpinner: false }} shallowRouting />
    </Layout>
  )
}
