import React, { useEffect, useRef } from "react";
import "../styles/CloudinaryGallery.css";

const CloudinaryGallery = () => {
  const initedRef = useRef(false);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (initedRef.current) return;
    if (!window.cloudinary?.galleryWidget) return;
    initedRef.current = true;

    instanceRef.current = window.cloudinary.galleryWidget({
      container: "#my-gallery",
      cloudName: "dtcgrtslg", 
      mediaAssets: [
        { publicId: "1_bpwqum" },
        { publicId: "2_lllour" },
        { publicId: "3_gfylqd" },

      ],
    

      aspectRatio: "16:9",

      carouselStyle: "indicators", 
      carouselLocation: "bottom", 
      zoom: true,
      navigation: "always", 
      themeProps: {
        image: { objectFit: "contain" },
        thumbnails: { position: "left" },
      },
    });

    instanceRef.current.render();

    return () => {
      instanceRef.current?.destroy?.();
      initedRef.current = false;
    };
  }, []);

  return (
    <div className="cld-gallery-wrap">
      <div id="my-gallery" />
    </div>
  );
};

export default CloudinaryGallery;