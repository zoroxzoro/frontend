// Carousel.jsx

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "../styles/app.scss"; // Import custom styles
import "../styles/Home.scss"; // Import custom styles

import { Navigation, Pagination } from "swiper/modules"; // Import Swiper core and required modules

// Define interface for the image object from Unsplash API
interface UnsplashImage {
  width: number;
  height: number;
  urls: {
    regular: string;
  };
  // Add more fields if needed based on the API response
}

const Carousel = () => {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch(
        "https://api.unsplash.com/photos/random?count=5&query=products&client_id=BIQzQdC4iY_WLjgyZFurGVD5jQqI4jqXxJ6_1MitLME"
      );
      const data: UnsplashImage[] = await response.json();

      // Filter images based on aspect ratio
      const filteredImages = data.filter((image: UnsplashImage) => {
        // Define acceptable aspect ratio range (e.g., between 0.75 and 1.5)
        const aspectRatio = image.width / image.height;
        return aspectRatio >= 0.75 && aspectRatio <= 1.5;
      });

      const imageUrls = filteredImages.map(
        (image: UnsplashImage) => image.urls.regular
      );
      setImages(imageUrls);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  return (
    <Swiper
      modules={[Navigation, Pagination]}
      navigation
      pagination={{ clickable: true }}
      loop={true}
      className="mySwiper"
    >
      {images.map((imageUrl, index) => (
        <SwiperSlide
          className="swiperslide"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          key={index}
        >
          <img
            src={imageUrl}
            alt={`Slide ${index + 1}`}
            className="swiper-image"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Carousel;
