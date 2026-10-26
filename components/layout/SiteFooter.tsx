"use client";
import { Droplets } from "lucide-react";
export function SiteFooter() {
  return (
    <footer>
      <div className="footer-inner">
        <div className="brand footer-brand">
          <Droplets size={23} />
          <span>
            WaterServe<small>Serving a better-connected Calbayog.</small>
          </span>
        </div>
        <p>Water service incident reporting portal</p>
        <span>Calbayog City, Samar · Philippines</span>
      </div>
      <div className="footer-bottom">
        WaterServe project · Not connected to official CCWD records.
        <span>Designed for our community. Built around you.</span>
      </div>
    </footer>
  );
}
