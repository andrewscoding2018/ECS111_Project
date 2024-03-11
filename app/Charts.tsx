import { useState } from "react";

const chartData = [
  {
    src: "/graphs/heatmap.png",
    description: "Heatmap showing the correlation between different variables.",
  },
  {
    src: "/graphs/heatmap_after_encoding.png",
    description: "Heatmap after encoding categorical variables.",
  },
  {
    src: "/graphs/pairgrid1.png",
    description:
      "Pairgrid showing distributions and relationships between several pairs of variables.",
  },
  {
    src: "/graphs/pairgrid2.png",
    description: "Another pairgrid with a different selection of variables.",
  },
  {
    src: "/graphs/rent_vs_size.png",
    description: "Scatter plot of rent prices versus property size.",
  },
];

const Charts = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((current) => (current + 1) % chartData.length);
  };

  const handlePrev = () => {
    setActiveIndex(
      (current) => (current - 1 + chartData.length) % chartData.length
    );
  };

  return (
    <div className="flex flex-col items-center gap-3 justify-center w-full">
      {/* <div className="flex justify-between items-center w-full max-w-4xl">
        <div className="grid gap-3 mr-5">
          <button onClick={handlePrev} className="btn">
            Prev
          </button>
          <button onClick={handleNext} className="btn">
            Next
          </button>
        </div>

        <div className="flex-grow">
          <div className="relative w-full overflow-hidden"> */}
      {/* Image */}
      {/* <img
              src={chartData[activeIndex].src}
              alt={`Chart ${activeIndex + 1}`}
              className="w-auto h-96 block mx-auto"
            />
          </div> */}
      {/* Description */}
      {/* <div className="text-center p-4 bg-slate-100 rounded-md mt-2">
            {chartData[activeIndex].description}
          </div>
        </div>
      </div> */}
      {/* Carousel */}
      <div className="carousel carousel-center w-1/2 max-w-4xl rounded-lg">
        {chartData.map((data, index) => (
          <div
            key={index}
            id={String(index + 1)}
            className="carousel-item w-full"
          >
            <img src={data.src} alt={data.description} className="w-full" />
          </div>
        ))}
      </div>
      {/* Descriptions */}
      <div className="text-center p-4 bg-base-300 rounded-md mt-2">
        {chartData[activeIndex].description}
      </div>
      {/* Buttons */}
      <div className="flex justify-center w-full py-2 gap-2">
        {chartData.map((_, index) => (
          <a
            key={index}
            href={`#${index + 1}`}
            className="btn btn-md"
            onClick={() => setActiveIndex(index)}
          >
            {index + 1}
          </a>
        ))}
      </div>
    </div>
  );
};

export default Charts;
