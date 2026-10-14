import { motion } from 'framer-motion'
import Hero from '../components/home/Hero'
import Stats from '../components/home/Stats'
import WhyChooseUs from '../components/home/WhyChooseUs'
import FleetShowcase from '../components/home/FleetShowcase'
import ServicesGrid from '../components/home/ServicesGrid'
import BookingProcess from '../components/home/BookingProcess'
import Safety from '../components/home/Safety'
import Destinations from '../components/home/Destinations'
import Corporate from '../components/home/Corporate'
import TrustedBy from '../components/home/TrustedBy'
import Awards from '../components/home/Awards'
import Testimonials from '../components/home/Testimonials'
import VehicleAvailability from '../components/home/VehicleAvailability'

import FAQSection from '../components/home/FAQSection'
import CTABanner from '../components/home/CTABanner'
import Marquee from '../components/ui/Marquee'

const MARQUEE_SERVICES = [
  'Airport Transfers', 'Outstation Trips', 'Corporate Travel', 'Wedding Transport',
  'Pilgrimage Tours', 'Employee Transport', 'Luxury Chauffeur', 'Event Logistics',
  'Hourly Rental', 'VIP Transfers', 'School Transport', 'Hotel Transfers',
]

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Hero />
      <Stats />

      {/* Gold service ticker */}
      <Marquee items={MARQUEE_SERVICES} speed={28} />

      <WhyChooseUs />
      <FleetShowcase />
      <ServicesGrid />
      <BookingProcess />
      <Safety />
      <Destinations />

      {/* Dark marquee separator */}
      <Marquee
        items={['Bangalore', 'Mysore', 'Ooty', 'Coorg', 'Chennai', 'Goa', 'Hyderabad', 'Mumbai', 'Tirupati', 'Shirdi']}
        speed={20}
        separator="→"
        dark
      />

      <Corporate />
      <TrustedBy />
      <Awards />
      <Testimonials />
      <VehicleAvailability />

      <FAQSection />
      <CTABanner />
    </motion.div>
  )
}
