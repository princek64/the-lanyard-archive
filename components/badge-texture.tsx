"use client";

import { useLoader } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { RepeatWrapping, SRGBColorSpace, TextureLoader } from "three";

export function useBadgeTexture(url: string, repeat = 1) {
  const source = useLoader(TextureLoader, url);
  const texture = useMemo(() => {
    const copy = source.clone();
    copy.colorSpace = SRGBColorSpace;
    copy.anisotropy = 4;
    if (repeat !== 1) {
      copy.wrapT = RepeatWrapping;
      copy.repeat.y = repeat;
    }
    return copy;
  }, [source, repeat]);

  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}
