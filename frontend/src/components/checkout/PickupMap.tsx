import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { Button } from "../ui/aria/Button";
import { LuPlus, LuMinus, LuCakeSlice } from "react-icons/lu";
import { tv } from "tailwind-variants";

const position: [number, number] = [51.40313097396538, -0.2730678337183401];
const maxZoom = 18;
const minZoom = 10;

const PickupMap: React.FC = () => {
  function MapControls() {
    const map = useMap();
    const [currentZoom, setCurrentZoom] = useState(map.getZoom());
    const [center, setCenter] = useState(map.getCenter());
    const controlsRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      if (controlsRef.current) {
        L.DomEvent.disableClickPropagation(controlsRef.current);
        L.DomEvent.disableScrollPropagation(controlsRef.current);
      }
    }, []);

    useEffect(() => {
      const updateMapState = () => {
        setCenter(map.getCenter());
        setCurrentZoom(map.getZoom());
      };

      map.on("moveend", updateMapState);
      map.on("zoomend", updateMapState);

      return () => {
        map.off("moveend", updateMapState);
        map.off("zoomend", updateMapState);
      };
    }, [map]);

    const canZoomOut = currentZoom - 1 >= minZoom;
    const canZoomIn = currentZoom + 1 <= maxZoom;
    const tolerance = 0.00001;
    const atOrigin =
      currentZoom === maxZoom && center.equals(position, tolerance);

    const buttonStyling = tv({
      base: "w-4/5 bg-brand-colour-2/70 backdrop-blur-xs text-default-bg hover:bg-brand-colour-5/40 hover:text-black p-1 focus:outline-brand-colour-4",
      variants: {
        isDisabled: {
          true: "text-brand-colour-2 pressed:scale-100 hover:text-brand-colour-2",
        },
      },
    });

    return (
      <div
        ref={controlsRef}
        className="absolute top-2 right-2 w-10 h-30 z-1000 flex flex-col justify-evenly items-center"
      >
        <Button
          variant="icon"
          className={buttonStyling}
          onClick={() => map.setView(position, maxZoom, { animate: true })}
          isDisabled={atOrigin}
        >
          <LuCakeSlice className="size-full" strokeWidth={2} />
        </Button>
        <Button
          variant="icon"
          className={buttonStyling}
          onClick={() => map.setZoom(map.getZoom() + 1)}
          isDisabled={!canZoomIn}
        >
          <LuPlus className="size-full" strokeWidth={2} />
        </Button>
        <Button
          variant="icon"
          className={buttonStyling}
          onClick={() => map.setZoom(map.getZoom() - 1)}
          isDisabled={!canZoomOut}
        >
          <LuMinus className="size-full" strokeWidth={2} />
        </Button>
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
