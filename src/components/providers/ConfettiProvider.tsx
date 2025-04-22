"use client";
import { useState, useEffect } from "react";
import React from "react";
import Confetti from "react-confetti";

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);
    handleResize(); // inicializa con el tamaño actual

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}

export default function ConfettiWrapper() {
  const { width, height } = useWindowSize();
  return <Confetti width={width} height={height} />;
}
