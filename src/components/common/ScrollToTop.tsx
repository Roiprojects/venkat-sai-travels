import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * ScrollToTop component ensures that whenever the route pathname changes,
 * the window scroll position is automatically reset to the top (scrollY = 0).
 * If a hash anchor is provided (e.g. #contact), it smoothly scrolls to that element.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '')
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }

    // Immediately reset scroll position to the top for all new route navigations
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto'
    })
  }, [pathname, hash])

  return null
}
