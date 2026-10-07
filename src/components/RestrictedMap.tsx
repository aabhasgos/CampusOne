"use client";
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

type Ticket = {
  id: string;
  department: string;
  issue: string;
  priority: string;
  status: string;
};

// Map departments to approximate campus coordinates
const getCoordinateForDepartment = (dept: string): [number, number] => {
  const d = dept.toLowerCase();
  if (d.includes("hostel") || d.includes("soft")) return [28.4485 + (Math.random()*0.0005), 77.5848 + (Math.random()*0.0005)];
  if (d.includes("mess") || d.includes("food")) return [28.4498 + (Math.random()*0.0005), 77.5842 + (Math.random()*0.0005)];
  if (d.includes("sport") || d.includes("gym")) return [28.4488 + (Math.random()*0.0005), 77.5860 + (Math.random()*0.0005)];
  if (d.includes("lib")) return [28.4513 + (Math.random()*0.0005), 77.5845 + (Math.random()*0.0005)];
  if (d.includes("security") || d.includes("gate")) return [28.4518 + (Math.random()*0.0005), 77.5815 + (Math.random()*0.0005)];
  return [28.4508 + (Math.random()*0.0005), 77.5840 + (Math.random()*0.0005)]; // Academic/IT fallback
};

const createAlertIcon = (isHighPriority: boolean) => {
  const color = isHighPriority ? "#DC2626" : "#D4AF37"; // Red for high, Gold for normal
  return L.divIcon({
    className: "bg-transparent",
    html: `
      <div style="position: relative; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background-color: ${color}; opacity: 0.5; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="position: relative; width: 10px; height: 10px; background-color: ${color}; border-radius: 50%; box-shadow: 0 0 10px ${color}; border: 1px solid #000;"></div>
      </div>
      <style>
        @keyframes ping {
          75%, 100% { transform: scale(2.5); opacity: 0; }
        }
      </style>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

export default function RestrictedMap() {
  const [tickets, setTickets] = useState<(Ticket & { coords: [number, number] })[]>([]);

  useEffect(() => {
    fetch("/api/tickets")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const openTickets = data.filter(t => t.status === "OPEN" || t.status === "IN_PROGRESS").map(t => ({
            ...t,
            coords: getCoordinateForDepartment(t.department)
          }));
          setTickets(openTickets);
        }
      })
      .catch(err => console.error("Failed to fetch tickets for map", err));
  }, []);

  const center: [number, number] = [28.4506, 77.5842]; 
  const bounds: L.LatLngBoundsExpression = [
    [28.4450, 77.5790],
    [28.4550, 77.5890],
  ];

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer 
        center={center} 
        zoom={17} 
        minZoom={16} 
        maxZoom={18} 
        maxBounds={bounds} 
        maxBoundsViscosity={1.0}
        style={{ width: "100%", height: "100%", backgroundColor: "#0A0A0A" }}
        zoomControl={false}
      >
        <TileLayer
          url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
          attribution="&copy; Google Maps"
        />
        
        {/* Render Live Ticket Anomalies */}
        {tickets.map(ticket => {
          const isHigh = ticket.priority?.toUpperCase().includes("HIGH");
          return (
            <Marker key={ticket.id} position={ticket.coords} icon={createAlertIcon(isHigh)}>
              <Popup className="bg-black border-border custom-popup">
                <div className="p-1 min-w-[150px]">
                  <div className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isHigh ? 'text-red-500' : 'text-primary'}`}>
                    {isHigh ? '⚠️ URGENT ALERT' : 'ACTIVE TICKET'}
                  </div>
                  <div className="text-black font-bold text-xs">{ticket.department}</div>
                  <div className="text-gray-700 text-xs mt-1">{ticket.issue}</div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
