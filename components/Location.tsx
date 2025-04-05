import React from "react";
import { Button } from "./ui/button";

const Location: React.FC = () => {
  const latitude: number = 22.4657; // Approximate latitude for Panchasayar area
  const longitude: number = 88.3702; // Approximate longitude for Panchasayar area

  const mapsLink: string = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

  const handleGetDirection = (): void => {
    window.open(mapsLink, "_blank");
  };

  return (
    <div>
      <div className="w-full max-w-[900px] h-[300px] mb-[30px] rounded-xl overflow-hidden md:max-w-full">
        <iframe
          src={`https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`}
          width="100%"
          height="100%"
          loading="lazy"
          style={{ border: 0 }}
          allowFullScreen
          title="Google Map"
        ></iframe>
      </div>
    </div>
  );
};

export default Location;
