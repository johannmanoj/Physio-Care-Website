import React, { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./DateSlider.css";

const DateSlider = () => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  const dates = [
    "18 Aug", "19 Aug", "20 Aug", "21 Aug",
    "22 Aug", "23 Aug", "24 Aug", "25 Aug",
    "26 Aug", "27 Aug", "28 Aug", "29 Aug",
    "30 Aug", "31 Aug", "01 Sep", "02 Sep"
  ];

  return (
    <div className="date-slider-container">
      {/* Left Arrow */}
      <button className="date-arrow left" onClick={() => scroll("left")}>
        <FaChevronLeft />
      </button>

      {/* Dates List */}
      <div className="date-slider" ref={scrollRef}>
        {dates.map((date, index) => (
          <div className="date-item" key={index}>
            {date}
          </div>
        ))}
      </div>

      {/* Right Arrow */}
      <button className="date-arrow right" onClick={() => scroll("right")}>
        <FaChevronRight />
      </button>
    </div>
  );
};

export default DateSlider;
