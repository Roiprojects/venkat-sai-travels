export const COMPANY = {
  name: 'Venkat Sai Travels',
  tagline: 'Luxury Travel Begins Here',
  founder: 'Mr. Babu',
  email: 'Ls.babu@yahoo.com',
  phones: ['9845009827', '9513709827', '9448735144'],
  whatsapp: '919845009827',
  address: {
    line1: 'T Nisarga, #687/22, 1st A Main',
    line2: 'D Block, 2nd Stage, Rajajinagar',
    city: 'Bangalore – 560010',
  },
  hours: 'Mon – Sun: 24 Hours / 7 Days',
}

export const WHATSAPP_URL = `https://wa.me/${COMPANY.whatsapp}?text=Hi%2C%20I'd%20like%20to%20book%20a%20vehicle%20with%20Venkat%20Sai%20Travels.`
export const CALL_URL = `tel:+91${COMPANY.phones[0]}`

export const STATS = [
  { value: 22, suffix: '+', label: 'Years of Experience' },
  { value: 10000, suffix: '+', label: 'Happy Customers' },
  { value: 50000, suffix: '+', label: 'Trips Completed' },
  { value: 200, suffix: '+', label: 'Corporate Clients' },
  { value: 50, suffix: '+', label: 'Luxury Fleet' },
]

export const FLEET = [
  { id: 1, name: 'Toyota Innova Crysta', category: 'SUV', seats: 7, fuel: 'Diesel', ac: true, features: ['GPS Tracked', 'Luxury Interior', 'Ample Luggage'], color: 'from-slate-800 to-slate-900' },
  { id: 2, name: 'PKN Deluxe', category: 'Van', seats: 9, fuel: 'Diesel', ac: true, features: ['9 Seater', 'Reclining Seats', 'Reading Lights'], color: 'from-zinc-800 to-zinc-900' },
  { id: 3, name: 'Urbania 16+1', category: 'Bus', seats: 17, fuel: 'Diesel', ac: true, features: ['16+1 Seater', 'Push-back Seats', 'USB Charging'], color: 'from-stone-800 to-stone-900' },
  { id: 4, name: 'Tempo Traveller', category: 'Van', seats: 12, fuel: 'Diesel', ac: true, features: ['12 Seater', 'Luggage Rack', 'Comfortable Seats'], color: 'from-neutral-800 to-neutral-900' },
  { id: 5, name: 'Toyota Etios', category: 'Sedan', seats: 4, fuel: 'Diesel/CNG', ac: true, features: ['Spacious Boot', 'Fuel Efficient', 'City & Outstation'], color: 'from-gray-800 to-gray-900' },
  { id: 6, name: 'Sedan', category: 'Luxury', seats: 4, fuel: 'Petrol', ac: true, features: ['Executive Class', 'Premium Interior', 'Chauffeur Driven'], color: 'from-yellow-900 to-yellow-950' },
  { id: 7, name: 'Luxury SUV', category: 'Luxury', seats: 6, fuel: 'Petrol', ac: true, features: ['VIP Experience', 'Panoramic Roof', 'Captain Seats'], color: 'from-red-950 to-red-900' },
  { id: 8, name: 'Mini Bus', category: 'Bus', seats: 24, fuel: 'Diesel', ac: true, features: ['24 Seater', 'Group Travel', 'Corporate Events'], color: 'from-slate-900 to-slate-800' },
  { id: 9, name: 'Luxury Bus', category: 'Bus', seats: 40, fuel: 'Diesel', ac: true, features: ['40 Seater', 'Sleeper Available', 'Premium Finish'], color: 'from-zinc-900 to-zinc-800' },
]

export const SERVICES = [
  { id: 1, icon: 'Plane', title: 'Airport Transfers', desc: 'Punctual airport pickup & drop service with flight tracking. Greet & meet service available.', vehicles: ['Sedan', 'SUV', 'Innova'] },
  { id: 2, icon: 'MapPin', title: 'Outstation Trips', desc: 'Comfortable one-way and round trip outstation travel across South India with experienced drivers.', vehicles: ['Innova', 'Etios', 'Tempo'] },
  { id: 3, icon: 'Briefcase', title: 'Corporate Travel', desc: 'Dedicated corporate account management with billing, priority booking, and 24/7 support.', vehicles: ['Executive Sedan', 'Luxury SUV', 'Bus'] },
  { id: 4, icon: 'Car', title: 'Car Rentals', desc: 'Hourly and daily car rentals for local city travel, shopping, and sightseeing in Bangalore.', vehicles: ['Innova Crysta', 'Etios Sedan', 'SUV'] },
  { id: 5, icon: 'Crown', title: 'Luxury Chauffeur', desc: 'VIP chauffeur-driven luxury cars for high-profile clients, executives, and special events.', vehicles: ['Luxury Sedan', 'Luxury SUV'] },
  { id: 6, icon: 'Heart', title: 'Wedding Transport', desc: 'Elegant wedding fleet packages including decorated cars, bridal coaches, and guest vehicles.', vehicles: ['Wedding Coach', 'Luxury Cars', 'Tempo'] },
  { id: 7, icon: 'Users', title: 'Employee Transport', desc: 'Reliable daily employee pickup & drop services for IT parks, offices, and factories.', vehicles: ['Staff Shuttle', 'Urbania', 'Tempo'] },
  { id: 8, icon: 'Mountain', title: 'Pilgrimage Tours', desc: 'Comfortable pilgrimage packages to Tirupati, Shirdi, Vaishno Devi, and all major temples.', vehicles: ['Innova', 'Tempo', 'Bus'] },
  { id: 9, icon: 'Star', title: 'Event Transportation', desc: 'Full logistics management for corporate events, conferences, parties, and large gatherings.', vehicles: ['Event Fleet', 'Luxury Bus', 'Mini Bus'] },
  { id: 10, icon: 'Compass', title: 'Family Trips', desc: 'Curated family holiday packages with comfortable vehicles and experienced tour guides.', vehicles: ['Innova', 'Tempo', 'Urbania'] },
  { id: 11, icon: 'Hotel', title: 'Hotel Transfers', desc: 'Seamless transfers between hotels, resorts, and tourist spots across Karnataka and beyond.', vehicles: ['Sedan', 'SUV', 'Innova'] },
  { id: 12, icon: 'Clock', title: 'Hourly Rental', desc: 'Flexible hourly package rentals for city meetings, hospital visits, and short-term needs.', vehicles: ['Sedan', 'SUV'] },
]

export const TESTIMONIALS = [
  { name: 'Rajesh Kumar', location: 'Bangalore', rating: 5, text: 'Exceptional service! The driver was punctual, the car was immaculate, and the overall experience was truly first-class. Venkat Sai Travels has set a new benchmark.', date: '2 weeks ago' },
  { name: 'Priya Sharma', location: 'Whitefield', rating: 5, text: 'Used their airport transfer service multiple times. Never once missed a flight. Professional, clean, and always on time. Highly recommended for corporate travel!', date: '1 month ago' },
  { name: 'Arun Mehta', location: 'HSR Layout', rating: 5, text: 'Booked the Urbania for our family trip to Ooty. Comfortable, spacious, and the driver was knowledgeable about all the tourist spots. Will book again!', date: '3 weeks ago' },
  { name: 'Sunitha Reddy', location: 'Indiranagar', rating: 5, text: 'Used them for my wedding. The decorated cars were stunning and everything was perfectly coordinated. Mr. Babu was very helpful throughout the planning process.', date: '2 months ago' },
  { name: 'Kiran Patel', location: 'Electronic City', rating: 5, text: 'Our company has been using Venkat Sai Travels for employee transport. Zero complaints in 2 years. Extremely reliable and professional team.', date: '1 week ago' },
  { name: 'Deepika Nair', location: 'Koramangala', rating: 5, text: 'The Innova Crysta was spotless and the driver was courteous. The journey to Mysore was very comfortable. Transparent pricing with no hidden charges.', date: '3 months ago' },
]

export const DESTINATIONS = [
  { name: 'Mysore', distance: '150 km', time: '3 hrs', tag: 'Most Popular', gradient: 'from-amber-900/80 to-amber-950/90' },
  { name: 'Coorg', distance: '250 km', time: '5 hrs', tag: 'Trending', gradient: 'from-green-900/80 to-green-950/90' },
  { name: 'Ooty', distance: '270 km', time: '6 hrs', tag: 'Weekend Getaway', gradient: 'from-blue-900/80 to-blue-950/90' },
  { name: 'Chennai', distance: '350 km', time: '6 hrs', tag: 'City Connect', gradient: 'from-orange-900/80 to-orange-950/90' },
  { name: 'Hyderabad', distance: '570 km', time: '10 hrs', tag: 'Overnight Option', gradient: 'from-purple-900/80 to-purple-950/90' },
  { name: 'Goa', distance: '560 km', time: '10 hrs', tag: 'Beach Escape', gradient: 'from-teal-900/80 to-teal-950/90' },
]

export const FAQ_DATA = [
  { q: 'How do I book a vehicle with Venkat Sai Travels?', a: 'You can book via WhatsApp, call us directly, or fill the booking form on our website. We confirm your booking within 30 minutes.' },
  { q: 'What are your operating hours?', a: 'We operate 24 hours a day, 7 days a week including all holidays and festivals.' },
  { q: 'Do you provide outstation services?', a: 'Yes, we cover all major destinations across South India including Mysore, Coorg, Ooty, Chennai, Hyderabad, Goa, and more.' },
  { q: 'Are your drivers verified and trained?', a: 'All our drivers hold valid commercial licenses, undergo background verification, and receive regular training in safety, courtesy, and route knowledge.' },
  { q: 'Do you provide airport pickup at night?', a: 'Absolutely! Our airport transfer service runs 24/7. We track your flight status to ensure timely pickup regardless of delays.' },
  { q: 'What vehicles are available for airport transfer?', a: 'We offer Etios sedans, Innova Crysta SUVs, and luxury cars for airport transfers based on your group size and preference.' },
  { q: 'Is GST included in the price?', a: 'All our prices are transparent with GST included. No hidden charges — what you see is what you pay.' },
  { q: 'Do you have corporate accounts?', a: 'Yes, we offer dedicated corporate accounts with monthly billing, priority booking, dedicated account managers, and customized solutions.' },
  { q: 'What is your cancellation policy?', a: 'Free cancellation up to 2 hours before pickup. Cancellations within 2 hours may incur a minimal charge. Contact us for full details.' },
  { q: 'Do you provide vehicles for weddings?', a: 'Yes! We offer complete wedding transportation packages including decorated bridal cars, guest shuttles, baraat vehicles, and luxury fleets.' },
]

export const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Fleet', path: '/fleet' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Contact', path: '/contact' },
]
