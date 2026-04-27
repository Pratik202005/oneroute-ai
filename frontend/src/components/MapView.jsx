import { useEffect, useState } from 'react'
import { GoogleMap, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api'

const containerStyle = { width: '100%', height: '100%' }
const libraries = ['geometry']

function MapView({ start, end, polylinePoints }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
    libraries
  })

  const [path, setPath] = useState([])

  useEffect(() => {
    if (isLoaded && typeof polylinePoints === 'string' && window.google) {
      const decoded = window.google.maps.geometry.encoding.decodePath(polylinePoints)
      setPath(decoded)
    } else if (Array.isArray(polylinePoints)) {
      setPath(polylinePoints)
    }
  }, [isLoaded, polylinePoints])

  if (!isLoaded) {
    return <div className="w-full h-full flex items-center justify-center text-white/70">Loading map...</div>
  }

  const center = start || { lat: 19.076, lng: 72.8777 } // fallback (Mumbai)

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={7} options={{ disableDefaultUI: true }}>
      {start && <Marker position={start} />}
      {end && <Marker position={end} />}

      {path.length > 0 && (
        <Polyline
          path={path}
          options={{
            strokeColor: '#14B8A6',
            strokeOpacity: 0.95,
            strokeWeight: 5,
          }}
        />
      )}
    </GoogleMap>
  )
}

export default MapView