"use client";
import Confetti from "react-confetti";
import { useEffect, useState } from "react";

export default function ConfettiSection() {
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
  }, []);

  return (
    <>
      <Confetti
        width={dimensions.width}
        height={dimensions.height}
        numberOfPieces={3000}
        recycle={false}
        gravity={0.2}
        initialVelocityX={10}
        initialVelocityY={60}
        explosionPower={5}
      />
    </>
  );
}
