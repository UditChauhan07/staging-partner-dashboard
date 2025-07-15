import type { Metadata } from 'next'
import './globals.css'
import "react-country-state-city/dist/react-country-state-city.css";


export const metadata: Metadata = {
  title: 'Rexpt',
  description: 'Rexpt',
  icons: {
    icon: '/rexpt-main.png', 
  },

}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
      <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAw8vb3_BycQW54zQSmpKcYveVBuxt-epY&libraries=places"
    async defer></script>
    </html>
  )
}
