import { Image, buildSrc } from "@imagekit/react";
import { useCallback, useState } from "react";

const IKImage = ({ src, alt, className, width, height }) => {
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const hidePlaceholder = () => setShowPlaceholder(false);

  const placeholder = buildSrc({
    urlEndpoint: import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT,
    src: src,
    transformation: [{ quality: 10, blur: 90 }],
  });

  //   to listen to the image loading status, if the image is loaded, hide the placeholder
  const imgRef = useCallback((img) => {
    if (!img) return;

    if (img.complete) {
      hidePlaceholder();
      return;
    }
  }, []);

  return (
    <Image
      urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      ref={imgRef}
      onLoad={hidePlaceholder}
      width={width}
      height={height}
      style={
        showPlaceholder
          ? {
              backgroundImage: `url(${placeholder})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }
          : {}
      }
      transformation={[
        {
          width: width,
          height: height,
        },
      ]}
    />
  );
};

export default IKImage;
