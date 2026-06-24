import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar'
import '@/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const isAdmin = router.pathname.startsWith('/admin')

  if (isAdmin) {
    return <Component {...pageProps} />
  }

  return (
    <Layout>
      <Component {...pageProps} />
      <ProgressBar height="3px" color="#C9A84C" options={{ showSpinner: false }} shallowRouting />
    </Layout>
  )
}
