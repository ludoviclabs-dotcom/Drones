import { ImageResponse } from "next/og";
import { renderSiteOgCard } from "@/components/og-card";

export const alt =
  "Panoplie — Intelligence open source sur les systèmes de défense";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(renderSiteOgCard(), size);
}
