import { useState } from "react";
import Map, { Marker } from "react-map-gl";
import type { MapMouseEvent } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Header, Footer } from "../components/layout";

type Pin = {
  id: number;
  lat: number;
  lng: number;
  placeName?: string;
  country?: string;
  media?: File | null;
  audio?: File | null;
  reflection?: string;
};

export default function Explore() {
  const [pins, setPins] = useState<Pin[]>([]);
  const [activePin, setActivePin] = useState<Pin | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);

  const handleMapClick = (e: MapMouseEvent) => {
    const { lng, lat } = e.lngLat;
    const newPin: Pin = {
      id: Date.now(),
      lat,
      lng,
    };
    setPins((prev) => [...prev, newPin]);
    setActivePin(newPin);
  };

  const savePin = (updated: Pin) => {
    setPins((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setActivePin(null);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Header userName="Eleanor"/>

      <div className="flex flex-1 overflow-hidden">
        {/* Left side: Map (70%) */}
        <div className="w-[70%] relative">
          <Map
            mapboxAccessToken={import.meta.env.VITE_MAPBOX_API_KEY}
            initialViewState={{
              longitude: 2.3522, // Paris center
              latitude: 48.8566,
              zoom: 3,
            }}
            style={{ width: "100%", height: "100%" }}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            onClick={handleMapClick}
          >
            {pins.map((pin) => (
              <Marker
                key={pin.id}
                latitude={pin.lat}
                longitude={pin.lng}
                color="red"
                onClick={(e: MapMouseEvent) => {
                  e.originalEvent.stopPropagation();
                  setActivePin(pin);
                }}
              />
            ))}
          </Map>

          {/* Active Pin Side Panel */}
          {activePin && (
            <div className="absolute right-0 top-0 h-full w-1/3 bg-white shadow-lg p-4 overflow-y-auto">
              <h2 className="text-lg font-bold mb-2">📍 Add Details</h2>
              <p>
                Coordinates: {activePin.lat.toFixed(4)},{" "}
                {activePin.lng.toFixed(4)}
              </p>

              {/* Media upload */}
              <div className="mt-4">
                <label className="block font-semibold">Add Media</label>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) =>
                    setActivePin({
                      ...activePin,
                      media: e.target.files ? e.target.files[0] : null,
                    })
                  }
                />
              </div>

              {/* Audio upload */}
              <div className="mt-4">
                <label className="block font-semibold">Add Audio</label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) =>
                    setActivePin({
                      ...activePin,
                      audio: e.target.files ? e.target.files[0] : null,
                    })
                  }
                />
              </div>

              {/* Reflection */}
              <div className="mt-4">
                <label className="block font-semibold">Reflection</label>
                <textarea
                  className="w-full border rounded p-2"
                  rows={4}
                  placeholder="Write your thoughts..."
                  value={activePin.reflection || ""}
                  onChange={(e) =>
                    setActivePin({
                      ...activePin,
                      reflection: e.target.value,
                    })
                  }
                />
              </div>

              {/* Save button */}
              <button
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => savePin(activePin)}
              >
                Save
              </button>
            </div>
          )}

          {/* Floating button to reopen instructions */}
          {!showInstructions && (
            <button
              className="absolute bottom-4 right-4 px-4 py-2 bg-blue-600 text-black rounded shadow hover:bg-blue-700"
              onClick={() => setShowInstructions(true)}
            >
              Open Instructions
            </button>
          )}
        </div>

        {/* Right side: Instruction panel (30%) */}
        <div
          className={`relative transition-all duration-300 ease-in-out ${
            showInstructions ? "w-[30%]" : "w-0"
          }`}
        >
          {/* Panel content */}
          <div
            className={`h-full bg-gray-100 border-l p-6 absolute top-0 right-0 transition-transform duration-300 ease-in-out ${
              showInstructions ? "translate-x-0" : "translate-x-full"
            }`}
            style={{ width: "30%" }}
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => setShowInstructions(false)}
            >
              ✖
            </button>
            <h2 className="text-2xl font-bold mb-4">Welcome to Travel Diary!</h2>
            <p className="text-gray-700">
              Document your travels with audiovisual and written memories.
              <br />
              <br />
              Click on the map to drop a pin, then add photos, audio, and your
              reflections about the place.
            </p>
          </div>
        </div>

        {/* Arrow toggle when closed — sticks to screen edge */}
        {!showInstructions && (
          <button
            className="fixed top-1/2 right-0 -translate-y-1/2 bg-blue-500 text-white p-2 rounded-l shadow hover:bg-blue-600 z-50"
            onClick={() => setShowInstructions(true)}
          >
            ➤
          </button>
        )}

        </div>

        {/* Footer */}
        <Footer />
    </div>
  );
}
