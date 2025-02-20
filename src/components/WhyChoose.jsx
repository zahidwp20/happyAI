import React from "react";
import LimitedSupply from "./icons/LimitedSupply";
import ProfitSharing from "./icons/ProfitSharing";
import Growth from "./icons/Growth";
import Deflationary from "./icons/Deflationary";

export default function WhyChoose() {
  return (
    <div
      className="py-[50px] sm:py-[144px]"
      style={{ backgroundImage: "url(/why-choose-bg.svg)" }}
    >
      <div className="flex justify-center">
        <div className="w-full max-w-[1145px] px-4 sm:px-0">
          <h2 className="lg:text-5xl text-2xl text-center text-[#15447E] font-luckiest-guy">
            Why Choose $Just A Happy Guy AI?
          </h2>
          <div className="mt-[50px] sm:mt-[85px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-[30px]">
            {/* 1 */}
            <div className="relative col-span-1 bg-white p-[20px] rounded-[10px] box-shadow mb-4 sm:mb-0">
  {/* Logo Inside Box */}
  <div className="flex justify-center items-center mb-6">
    <img src="/logo1.png" alt="" className="h-[100px] w-[100px]" />
  </div>

  <h3 className="text-center text-[#15447E] text-[18px] sm:text-[22px] font-luckiest-guy">
    Fixed Supply
  </h3>
  <p className="mb-[40px] sm:mb-[55px] text-center mt-6 text-[#15447E] font-medium">
    There will only be ever 1 Billion Happy Guy AI tokens, ensuring never new tokens are created and the supply is fixed.
  </p>

  {/* Step Number */}
  <div className="absolute -bottom-8 left-0 right-0 flex flex-col items-center">
    <div
      className="bg-cover flex justify-center items-center h-[60px] w-[60px] text-[#000] text-[25px] font-medium"
      style={{ backgroundImage: "url(/step-bg.svg)" }}
    >
      1
    </div>
  </div>
</div>


            {/* 2 */}
            <div className="relative col-span-1 bg-white p-[20px] rounded-[10px] box-shadow mb-4 sm:mb-0">
  {/* Logo Inside Box */}
  <div className="flex justify-center items-center mb-6">
    <img src="/logo2.png" alt="Profit Sharing" className="h-[100px] w-[100px]" />
  </div>

  <h3 className="text-center text-[#15447E] text-[18px] sm:text-[22px] font-luckiest-guy">
    Community Driven
  </h3>
  <p className="mb-[40px] sm:mb-[55px] text-center mt-6 text-[#15447E] font-medium">
    Happy Guy AI is borne from the initiative of Aigisos community of nearly 150,000 users who want a beloved mascot for Aigisos AI module.
  </p>

  {/* Step Number */}
  <div className="absolute -bottom-8 left-0 right-0 flex flex-col items-center">
    <div
      className="bg-cover flex justify-center items-center h-[60px] w-[60px] text-[#000] text-[25px] font-medium"
      style={{ backgroundImage: "url(/step-bg.svg)" }}
    >
      2
    </div>
  </div>
</div>


            {/* 3 */}
            <div className="relative col-span-1 bg-white p-[20px] rounded-[10px] box-shadow mb-4 sm:mb-0">
  {/* Logo Inside Box */}
  <div className="flex justify-center items-center mb-6">
    <img src="/logo3.png" alt="Growth Incentives" className="h-[100px] w-[100px]" />
  </div>

  <h3 className="text-center text-[#15447E] text-[18px] sm:text-[22px] font-luckiest-guy">
    AI Trading Helper
  </h3>
  <p className="mb-[40px] sm:mb-[55px] text-center mt-6 text-[#15447E] font-medium">
    Let Just a Happy Guy AI help make your trading journey easier and make you go from strength to strength. 
  </p>

  {/* Step Number */}
  <div className="absolute -bottom-8 left-0 right-0 flex flex-col items-center">
    <div
      className="bg-cover flex justify-center items-center h-[60px] w-[60px] text-[#000] text-[25px] font-medium"
      style={{ backgroundImage: "url(/step-bg.svg)" }}
    >
      3
    </div>
  </div>
</div>

            {/* 4 */}
            <div className="relative col-span-1 bg-white p-[20px] rounded-[10px] box-shadow">
  {/* Logo Inside Box */}
  <div className="flex justify-center items-center mb-6">
    <img src="/logo4.png" alt="Deflationary Mechanism" className="h-100px] w-[100px]" />
  </div>

  <h3 className="text-center text-[#15447E]   text-[18px] sm:text-[22px] font-luckiest-guy">
    A more Positive Future
  </h3>
  <p className="mb-[40px] sm:mb-[55px] text-center mt-6 text-[#15447E] font-medium">
  Just a Happy Guy AI embodies the true spirit of positivity. Time to make great strides in your life and grow into the best version of yourself. 
  </p>

  {/* Step Number */}
  <div className="absolute -bottom-8 left-0 right-0 flex flex-col items-center">
    <div
      className="bg-cover flex justify-center items-center h-[60px] w-[60px] text-[#000] text-[25px] font-medium"
      style={{ backgroundImage: "url(/step-bg.svg)" }}
    >
      4
    </div>
  </div>
</div>

          </div>
        </div>
      </div>
    </div>
  );
}
