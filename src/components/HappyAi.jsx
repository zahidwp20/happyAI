import React from "react";

export default function HappyAi() {
  return (
<div className="bg-[#C3D4FD] py-20 lg:py-0" id="about">
  <div className="flex justify-center">
    <div className="w-full px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
        {/* Text Section */}
        <div
          className="mobile-background bg-contain bg-no-repeat bg-center px-[15px] sm:px-[40px] py-[20px] sm:py-[32px] w-full max-w-[90%] sm:max-w-[700px] md:max-w-[720px] mx-auto"
          style={{ backgroundImage: "url(/happy-guy-ai.png)" }}
        >
          <h2 className="text-[20px] sm:text-[40px] md:text-[45px] text-[#15447E] text-center sm:text-left font-luckiest-guy">
            Just a Happy Guy AI
          </h2>
          <p className="text-[14px] sm:text-[18px] md:text-[20px] text-[#15447E] mt-4 text-center sm:text-left">
          AI agent uses neural networks and machine learning AI algorithms to predict crypto prices 10 days into the future.

          Ask anything trading related and just a Happy Guy AI will give you laser precision trading suggestion.
          <p>Happy Guy AI is here to make the world a more positive place brimming with great opportunities for everyone</p>
          </p>
        </div>

        {/* Image Section */}
        <div>
          <img
            src="/happy-ai-img.png"
            alt="Happy AI mascot"
            className="w-auto max-w-[300px] sm:max-w-[400px] md:max-w-[500px]"
          />
        </div>
      </div>
    </div>
  </div>
</div>









  );
}
