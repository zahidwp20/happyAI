import React from "react";
import XCTA from "./icons/XCTA";
import TelegramCTA from "./icons/TelegramCTA";

export default function Embark() {
  return (
    <div className="flex justify-center">
      <div
        className="box-shadow w-full sm:w-[1145px] box-shadow rounded-[20px] my-20 py-[60px] px-[24px] sm:px-[84px] bg-cover mx-4 sm:mx-[20px]"
        style={{ backgroundImage: "url(/EMBARK-BG.png)" }}
      >
        {/* Title */}
        <h2 className="text-white font-luckiest-guy text-center lg:text-5xl text-2xl">
          Embark On The Journey With Happy Guy AI
        </h2>

        {/* Description */}
        <p className="max-w-[786px] text-center text-white mt-6 mx-auto font-regular text-lg">
        We want everyone to stay optimistic and expect for a future that uplifts everyone through all the latest technology advancement and a wonderful future to all.
        </p>

        {/* Action Buttons (Stacked for mobile, side-by-side for desktop) */}
        <div className="flex justify-center mt-[36px] sm:mt-[46px]">
          <div className="flex flex-col sm:flex-row gap-[20px] sm:gap-[38px]">
            <XCTA />
            <TelegramCTA />
          </div>
        </div>
      </div>
    </div>
  );
}
