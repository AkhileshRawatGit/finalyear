"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Fix for default marker icon
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
})

const userIcon = L.icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
})

const deliveryIcon = L.icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
})

function MapUpdater({ center, routeCoordinates, navigationTarget, userLocation }: { 
    center: [number, number], 
    routeCoordinates?: [number, number][],
    navigationTarget?: [number, number],
    userLocation?: [number, number]
}) {
    const map = useMap()
    
    useEffect(() => {
        if (routeCoordinates && routeCoordinates.length > 0) {
            const bounds = L.latLngBounds(routeCoordinates)
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 })
        } else if (navigationTarget && userLocation) {
            const bounds = L.latLngBounds([userLocation, navigationTarget])
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 })
        } else {
            map.setView(center, 13)
        }
    }, [center, routeCoordinates, navigationTarget, userLocation, map])
    
    return null
}

function MapClickHandler({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) {
    useMapEvents({
        click: (e) => {
            if (onMapClick) {
                onMapClick(e.latlng.lat, e.latlng.lng)
            }
        },
    })
    return null
}

interface MapProps {
    center: [number, number]
    markers: Array<{
        id: string
        position: [number, number]
        title: string
        content: React.ReactNode
    }>
    userLocation?: [number, number]
    deliveryLocation?: [number, number]
    navigationTarget?: [number, number]
    routeCoordinates?: [number, number][]
    onMapClick?: (lat: number, lng: number) => void
}

export default function LeafletMap({ center, markers, userLocation, deliveryLocation, navigationTarget, routeCoordinates, onMapClick }: MapProps) {
    return (
        <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapUpdater 
                center={center} 
                routeCoordinates={routeCoordinates} 
                navigationTarget={navigationTarget} 
                userLocation={userLocation}
            />
            <MapClickHandler onMapClick={onMapClick} />

            {userLocation && (
                <Marker position={userLocation} icon={userIcon}>
                    <Popup>You are here</Popup>
                </Marker>
            )}

            {deliveryLocation && (
                <Marker position={deliveryLocation} icon={deliveryIcon}>
                    <Popup><b>Delivery</b> in progress...</Popup>
                </Marker>
            )}

            {routeCoordinates && routeCoordinates.length > 0 && (
                <Polyline 
                    positions={routeCoordinates} 
                    color="#3b82f6" 
                    weight={5} 
                    opacity={0.8} 
                    lineJoin="round"
                />
            )}

            {!routeCoordinates && navigationTarget && userLocation && (
                <Polyline 
                    positions={[userLocation, navigationTarget]} 
                    color="#0066FF" 
                    weight={4} 
                    opacity={0.6} 
                    dashArray="10, 10" 
                />
            )}

            {markers.map((marker) => (
                <Marker key={marker.id} position={marker.position} icon={icon}>
                    <Popup>{marker.content}</Popup>
                </Marker>
            ))}
        </MapContainer>
    )
}
