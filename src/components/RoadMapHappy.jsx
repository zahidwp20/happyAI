import React from "react";
import RoadmapBanner from "./icons/RoadmapBanner";

export default function RoadMap() {
  return (
    <div className="py-24 bg-[#C0D0FD] flex justify-center" id="roadmap">
      <div className="w-full sm:w-[1145px] px-4">
        {/* Roadmap Title */}

        <div>
          <div>
            {/* Title for Token Roadmap */}
           
            <h2 className="lg:text-5xl text-2xl text-[#3A80FE] font-bold font-luckiest-guy text-center">Token Roadmap</h2>

            {/* Desktop and Mobile Description */}
            <p className=" text-[#15447E] font-regular text-lg mt-4 mb-10 text-center">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br className="hidden md:inline-block" /> Sed quis
              accumsan nisi Ut ut felis congue nisl hendrerit commodo.
            </p>
          </div>

          {/* Desktop - RoadmapBanner */}
          <div className="hidden sm:block">
            <RoadmapBanner />
          </div>

          {/* Mobile - Box with Text */}
          <div
            className="sm:hidden bg-cover bg-no-repeat w-full"
            style={{
              backgroundImage: "url(/mobileroadmap.svg)", // Mobile image URL
              height: "780px", // Height for mobile image
              minHeight: "400px", // Minimum height for mobile image
              marginTop: "20px", // Margin-top for mobile
              marginBottom: "10px", // Margin-bottom for mobile
            }}
          >
          </div>
        </div>
      </div>
    </div>
  );
}
