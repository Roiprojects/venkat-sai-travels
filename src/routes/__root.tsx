import {
  Outlet,
  ScrollRestoration,
  createRootRoute,
  HeadContent,
  Scripts,
  useLocation,
} from '@tanstack/react-router'
import ScrollToTop from '../components/common/ScrollToTop'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import FloatingWidgets from '../components/layout/FloatingWidgets'
import LoadingScreen from '../components/ui/LoadingScreen'
import '../index.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      {
        name: 'description',
        content:
          'Venkat Sai Travels - Premium luxury tours and travels in Bangalore. Airport transfers, outstation trips, corporate travel, wedding transportation and more.',
      },
      {
        name: 'keywords',
        content:
          'luxury travels Bangalore, airport transfer Bangalore, outstation cab Bangalore, corporate travel, wedding transportation Bangalore, Venkat Sai Travels',
      },
      { name: 'author', content: 'Venkat Sai Travels' },
      { property: 'og:title', content: 'Venkat Sai Travels | Luxury Travel in Bangalore' },
      { property: 'og:description', content: 'Premium chauffeur & vehicle rental services in Bangalore' },
      { property: 'og:type', content: 'website' },
      { title: 'Venkat Sai Travels | Luxury Travel in Bangalore' },
    ],
    links: [
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,700&family=Inter:wght@300;400;500;600;700&display=swap',
      },
      {
        rel: 'stylesheet',
        href: 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css',
      },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-white text-[#222222] font-body antialiased selection:bg-brand-100 selection:text-brand-700">
        <ScrollToTop />
        <LoadingScreen />
        {!isAdmin && <Navbar />}
        <main>
          <Outlet />
        </main>
        {!isAdmin && <Footer />}
        {!isAdmin && <FloatingWidgets />}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}
