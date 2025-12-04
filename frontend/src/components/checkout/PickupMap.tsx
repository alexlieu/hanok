import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { Map as LeafletMap } from "leaflet";
import { Button } from "../ui/aria/Button";
import { LuPlus, LuMinus, LuCakeSlice } from "react-icons/lu";
import { tv } from "tailwind-variants";
import { AnimatePresence, motion } from "motion/react";
import { IoMdExpand } from "react-icons/io";

const position: [number, number] = [51.40313097396538, -0.2730678337183401];
const maxZoom = 18;
const minZoom = 10;

const PickupMap: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const mapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.invalidateSize();
    }
  }, [isExpanded]);

  useEffect(() => {
    if (isExpanded) {
      // What if there is no scrollbar?
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "unset";
    };
  }, [isExpanded]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsExpanded(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

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
        className="absolute top-0 right-0 pt-2 pb-5 pr-2 w-12 h-full z-[1000] flex flex-col justify-between"
      >
        <div className="w-full h-30 flex flex-col justify-evenly items-center">
          <Button
            variant="icon"
            className={buttonStyling({ isDisabled: atOrigin })}
            onClick={() => map.setView(position, maxZoom, { animate: true })}
            aria-disabled={atOrigin}
          >
            <LuCakeSlice className="size-full" strokeWidth={2} />
          </Button>
          <Button
            variant="icon"
            className={buttonStyling({ isDisabled: !canZoomIn })}
            onClick={() => map.setZoom(map.getZoom() + 1)}
            aria-disabled={!canZoomIn}
          >
            <LuPlus className="size-full" strokeWidth={2} />
          </Button>
          <Button
            variant="icon"
            className={buttonStyling({ isDisabled: !canZoomOut })}
            onClick={() => map.setZoom(map.getZoom() - 1)}
            aria-disabled={!canZoomOut}
          >
            <LuMinus className="size-full" strokeWidth={2} />
          </Button>
        </div>
        <Button
          variant="icon"
          className={buttonStyling()}
          onClick={() => setIsExpanded((prevVal) => !prevVal)}
        >
          <IoMdExpand className="size-full" strokeWidth={2} />
        </Button>
      </div>
    );
  }

  const mapContainerStyle = tv({
    base: "overflow-hidden bg-gray-100 shadow-sm",
    variants: {
      isExpanded: {
        true: "fixed inset-0 z-50 h-[90%] w-[90%] m-auto",
        false: "relative w-full aspect-3/2 sm:aspect-square mx-auto",
      },
    },
  });

  return (
    <>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-default-bg/5 z-40 backdrop-blur-xl"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>
      <div className={mapContainerStyle({ isExpanded: false })}>
        <div
          role={isExpanded ? "dialog" : undefined}
          aria-modal={isExpanded ? "true" : undefined}
          className={mapContainerStyle({ isExpanded })}
        >
          <MapContainer
            ref={mapRef}
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
                203 Kingston Rd, New Malden KT3 3SS <br /> Pickup your order
                here!{" "}
              </Popup>
            </Marker>
            <MapControls />
          </MapContainer>
        </div>
      </div>
    </>
  );
};

export default PickupMap;
