import { GoogleMap, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api'

const containerStyle = { width: '100%', height: '100%' }

function MapView({ start, end, polylinePoints }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
  })

  if (!isLoaded) {
    return <div className="w-full h-full flex items-center justify-center text-white/70">Loading map...</div>
  }

  const center = start || { lat: 19.076, lng: 72.8777 } // fallback (Mumbai)

  // If we have polylinePoints decoded already, draw it
  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={7} options={{ disableDefaultUI: true }}>
      {start && <Marker position={start} />}
      {end && <Marker position={end} />}

      {polylinePoints?.length > 0 && (
        <Polyline
          path={polylinePoints}
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