import React from "react";

export default function PlanSection() {
  return (
    <div
      className="py-24 bg-cover bg-no-repeat bg-center"
      style={{ backgroundImage: "url(/plan-section-bg.svg)" }}
    >
      <div className="flex justify-center">
        <div className="w-full max-w-[1145px] px-4">
          <div className="bg-white rounded-3xl shadow-[0px_0px_10px_rgba(58,128,254,0.15)] p-8">
            <h2 className="text-center text-black/80 text-lg leading-7 architects-daughter-regular">
              Just a Happy Guy AI represents positivity and was borne through the will of the Aigisos crypto community, with thousands of users voting to select it as our AI mascot. It is completely community-driven. When the entire crypto scene sometimes seems bleak, Just a Happy Guy AI wants you to be optimistic about a brighter future—a better life for everyone in crypto.
            </h2>
            <p className="mt-4 text-black/80 text-center text-xl architects-daughter-regular">4% team, rest to community, airdrop, sale, and liquidity.</p>
            <h2 className="mt-8 text-center text-[#3A80FE] font-luckiest-guy text-lg leading-7 architects-daughter-regular">
              $HAPPYGUY Staking with up to 70% APY. Stake your HAPPYGUY on the platform and watch your earnings grow while contributing to the ecosystem's stability and security.
            </h2>
          </div>
          <div className="flex justify-center mt-12 flex-wrap gap-6">
            {[
              "Access the Just a Happy Guy AI Dashboard",
              "Chat with Just a Happy Guy AI agent",
              "Get AI trading signals by Happy Guy AI agent",
            ].map((text, index) => (
              <div
                key={index}
                className="flex justify-center items-center w-full sm:w-[300px] h-[177px] bg-[#3A80FE] rounded-2xl text-white font-bold text-lg text-center p-4"
              >
                {text}
              </div>
            ))}
          </div>

          <h2 className="mt-12 text-center text-[#3A80FE] font-luckiest-guy text-lg sm:text-xl leading-6 sm:leading-7">
            To participate in staking, you must be an $HAPPYGUY holder.
          </h2>

          <div className="flex justify-center mt-8 flex-wrap gap-6">
            {[
              { title: "Plan 1", rate: "2.5%", period: "30 days" },
              { title: "Plan 2", rate: "3.0%", period: "60 days" },
              { title: "Plan 3", rate: "5.0%", period: "90 days" },
            ].map((plan, index) => (
              <div
                key={index}
                className="w-full sm:w-[265px] h-[302px] bg-cover bg-no-repeat rounded-2xl p-6 flex flex-col justify-center items-center text-white"
                style={{ backgroundImage: "url(/plan-card-bg.png)" }}
              >
                <h3 className="text-2xl font-medium text-center font-luckiest-guy">{plan.title}</h3>
                <p className="mt-4 text-lg">{plan.rate}</p>
                <p className="mt-2 font-bold">Period: {plan.period}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
