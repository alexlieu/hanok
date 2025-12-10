import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  memo,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import L, { LatLng } from "leaflet";
import { Button } from "../ui/aria/Button";
import { LuPlus, LuMinus, LuCakeSlice } from "react-icons/lu";
import { tv } from "tailwind-variants";
import { Dialog } from "react-aria-components";
import { ExpandIcon } from "../ui/icons/Expand";
import { ShrinkIcon } from "../ui/icons/Shrink";
import { MotionModal } from "../ui/aria/MotionModal";
import { motion, Transition } from "motion/react";

const expandTransition: Transition = {
  type: "spring",
  stiffness: 450,
  damping: 30,
};

const position: LatLng = new LatLng(51.40313097396538, -0.2730678337183401);
const maxZoom = 18;
const minZoom = 10;

const MapContent = memo(
  ({
    isInteractive,
    onToggle,
    isExpanded,
    initialCenter,
    initialZoom,
    ref: mapRef,
  }: {
    isInteractive: boolean;
    onToggle?: () => void;
    isExpanded: boolean;
    initialCenter?: LatLng;
    initialZoom?: number;
    ref: RefObject<L.Map | null>;
  }) => {
    useEffect(() => {
      mapRef.current?.invalidateSize();
      // if (isInteractive) mapRef.current?.panTo(position, { animate: false });
    }, [isExpanded, mapRef]);
    return (
      <MapContainer
        ref={mapRef}
        center={initialCenter ? initialCenter : position}
        zoom={initialZoom ? initialZoom : maxZoom}
        maxZoom={maxZoom}
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
        {isInteractive && (
          <MapControls onToggle={onToggle} isExpanded={isExpanded} />
        )}
      </MapContainer>
    );
  }
);
const MapControls = memo(
  ({
    onToggle,
    isExpanded,
  }: {
    onToggle?: () => void;
    isExpanded: boolean;
  }) => {
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
            aria-label="Center map on store"
            aria-disabled={atOrigin}
          >
            <LuCakeSlice className="size-full" strokeWidth={2} />
          </Button>
          <Button
            variant="icon"
            className={buttonStyling({ isDisabled: !canZoomIn })}
            onClick={() => map.setZoom(map.getZoom() + 1)}
            aria-label="Zoom in"
            aria-disabled={!canZoomIn}
          >
            <LuPlus className="size-full" strokeWidth={2} />
          </Button>
          <Button
            variant="icon"
            className={buttonStyling({ isDisabled: !canZoomOut })}
            onClick={() => map.setZoom(map.getZoom() - 1)}
            aria-label="Zoom out"
            aria-disabled={!canZoomOut}
          >
            <LuMinus className="size-full" strokeWidth={2} />
          </Button>
        </div>
        <Button variant="icon" className={buttonStyling()} onClick={onToggle}>
          {({ isHovered, isFocusVisible }) =>
            isExpanded ? (
              <ShrinkIcon
                isHovered={isHovered}
                isFocusVisible={isFocusVisible}
              />
            ) : (
              <ExpandIcon
                isHovered={isHovered}
                isFocusVisible={isFocusVisible}
              />
            )
          }
        </Button>
      </div>
    );
  }
);

const PickupMap: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [syncedView, setSyncedView] = useState({
    center: position,
    zoom: maxZoom,
  });
  const inlineMapRef = useRef<L.Map | null>(null);
  const expandedMapRef = useRef<L.Map | null>(null);

  const syncMapState = useCallback((fromMap: L.Map | null) => {
    if (fromMap) {
      setSyncedView({
        center: fromMap.getCenter(),
        zoom: fromMap.getZoom(),
      });
    }
  }, []);

  const handleExpand = useCallback(() => {
    syncMapState(inlineMapRef.current);
    setIsOpen(true);
  }, [syncMapState]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        syncMapState(expandedMapRef.current);
      }
      setIsOpen(open);
    },
    [syncMapState]
  );

  useEffect(() => {
    if (!isOpen && inlineMapRef.current) {
      const mapRef = inlineMapRef.current;
      // The nested call of requestAnimationFrame() is the ensure that the
      // inline map is painted before we begin animating it
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const distanceMeters = position.distanceTo(syncedView.center);
          const calculatedDuration = Math.min(
            Math.max(distanceMeters / 5000, 0.3),
            1
          );
          mapRef.invalidateSize();
          mapRef.setView(position, maxZoom, {
            animate: true,
            duration: calculatedDuration,
            easeLinearity: 0.25,
          });
        });
      });
    }
  }, [isOpen, syncedView.center]);

  return (
    <>
      <div className="relative w-full aspect-3/2 sm:aspect-square mx-auto">
        {!isOpen && (
          <motion.div
            layoutId="pickup-map-card"
            className="w-full h-full overflow-hidden"
            transition={expandTransition}
          >
            <MapContent
              isInteractive={true}
              onToggle={handleExpand}
              isExpanded={false}
              initialCenter={syncedView.center}
              initialZoom={syncedView.zoom}
              ref={inlineMapRef}
            />
          </motion.div>
        )}

        <MotionModal
          isOpen={isOpen}
          onOpenChange={handleOpenChange}
          isDismissable
          size="full"
          className="bg-transparent shadow-none border-none p-0 flex items-center justify-center pointer-events-none"
          onExitComplete={() => {
            syncMapState(expandedMapRef.current);
          }}
        >
          <Dialog
            className="outline-none pointer-events-auto"
            aria-label="Pickup location map"
          >
            {({ close }) => (
              <motion.div
                layoutId="pickup-map-card"
                className="h-[80vh] w-[90vw] md:w-[80vh] md:h-[80vh] bg-white overflow-hidden relative"
                transition={expandTransition}
              >
                <MapContent
                  ref={expandedMapRef}
                  isInteractive={true}
                  isExpanded={true}
                  onToggle={close}
                  initialCenter={syncedView.center}
                  initialZoom={syncedView.zoom}
                />
              </motion.div>
            )}
          </Dialog>
        </MotionModal>
      </div>
    </>
  );
};

export default PickupMap;
