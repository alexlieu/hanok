import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { AiOutlineShop } from "react-icons/ai";
import { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { CheckoutRequiredData } from "../../types/CheckoutType";

const position: [number, number] = [51.40313097396538, -0.2730678337183401];
const maxZoom = 18;
const minZoom = 10;

const PickupMap: React.FC = () => {
  const { pickupRules } = useLoaderData() as CheckoutRequiredData;
  console.log(pickupRules);

  function MapControls() {
    const map = useMap();
    const [currentZoom, setCurrentZoom] = useState(map.getZoom());

    useEffect(() => {
      const updateZoom = () => {
        setCurrentZoom(map.getZoom());
      };

      map.on("zoomend", updateZoom);

      return () => {
        map.off("zoomend", updateZoom);
      };
    }, [map]);

    const canZoomOut = currentZoom - 1 >= minZoom;
    const canZoomIn = currentZoom + 1 <= maxZoom;

    return (
      <div className="absolute top-0 right-0 w-15 h-35 gap-2 z-1000 flex flex-col justify-center items-center">
        <button
          type="button"
          className="w-1/2 aspect-square bg-stone-200 border-2 border-stone-900 group"
          onClick={() => {
            map.setView(position, maxZoom, { animate: true });
            // map.flyTo(position, maxZoom, { duration: 1, easeLinearity: 0.5 });
          }}
        >
          <AiOutlineShop className="size-full" />
        </button>
        <button
          type="button"
          className={`relative w-1/2 aspect-square bg-stone-200 border-2 border-stone-900 group`}
          onClick={() => {
            map.setZoom(map.getZoom() + 1);
          }}
        >
          <div
            className={`
                before:content-[''] before:absolute
                before:w-3/5 before:h-[3px]
                before:rounded-md
                before:left-1/2 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2
                before:transform before:transition-colors before:duration-250

                after:content-[''] after:absolute
                after:w-3/5 after:h-[3px]
                after:rounded-md
                after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2
                after:transform after:rotate-90 after:transition-colors after:duration-250

                ${
                  canZoomIn
                    ? "before:bg-black after:bg-black"
                    : "before:bg-gray-400 after:bg-gray-400"
                }

              `}
          ></div>
        </button>
        <button
          type="button"
          className="flex items-center justify-center w-1/2 aspect-square bg-stone-200 border-2 border-stone-900 group"
          onClick={() => {
            map.setZoom(map.getZoom() - 1);
          }}
        >
          <div
            className={`w-3/5 h-[3px] transition-colors duration-250 ${
              canZoomOut ? "bg-black" : "bg-gray-400"
            }`}
          ></div>
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-3/2 sm:aspect-square mx-auto">
      <MapContainer
        center={position}
        zoom={maxZoom}
        minZoom={minZoom}
        scrollWheelZoom={true}
        zoomControl={false}
        doubleClickZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            203 Kingston Rd, New Malden KT3 3SS <br /> Pickup your order here!{" "}
          </Popup>
        </Marker>
        <MapControls />
      </MapContainer>
    </div>
  );
};

export default PickupMap;
