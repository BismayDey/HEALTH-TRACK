"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

// Dynamically import the map component with no SSR
const Map = dynamic(() => import("./InteractiveMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] bg-gray-200 rounded-xl animate-pulse" />
  ),
});

export default function MapWrapper() {
  return (
    <Suspense
      fallback={
        <div className="h-[400px] bg-gray-200 rounded-xl animate-pulse" />
      }
    >
      <Map />
    </Suspense>
  );
}
