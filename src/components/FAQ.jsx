import React, { useState } from "react";

export default function FAQ() {
  const faqs = [
    {
      question: "How to Buy",
      answer: "You can buy HAPPYGUY tokens on our platform by connecting your wallet and completing the purchase through Our Website or supported exchanges."
    },
    {
      question: "Why did we create 'HAPPYGUY'?",
      answer: "HAPPYGUY was created as a unique meme coin with a mission to break away from the repetitive nature of other meme coins."
    },
    {
      question: "Is the contract renounced?",
      answer: "Yes, the contract is renounced to ensure security and prevent any future changes from the team."
    },
    {
      question: "Are the liquidity pools locked?",
      answer: "Yes, the liquidity pools are locked for 10 years to provide stability for the community."
    },
    {
      question: "Is the team KYC verified?",
      answer: "Yes, our team is fully KYC verified to establish trust and transparency."
    },
    {
      question: "Is the project SAFU?",
      answer: "Yes, HAPPYGUY is SAFU verified for 10 years, ensuring the safety of user funds."
    }
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col lg:flex-row justify-center items-center lg:items-start pt-24 px-4" id="faq">
      {/* Logo Section */}
      <div className="lg:w-2/5 flex justify-center lg:justify-start mb-8 lg:mb-0">
        <img
          src="/FaqImage.png"
          alt="Logo"
          className="w-100 h-auto lg:w-102"
        />
      </div>

      {/* FAQ Section */}
      <div className="lg:w-3/5 max-w-lg">
        <div className="text-center lg:text-left">
          <h2 className="lg:text-[46px] text-2xl font-bold text-blue-600 font-luckiest-guy">Frequently Questions</h2>
          <p className="text-md mt-4 text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis accumsan nisi ut ut felis congue nisl hendrerit commodo.
          </p>
        </div>
        <div className="mt-8">
          {faqs.map((faq, index) => (
            <div key={index} className="mb-4 border border-blue-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-4 py-3 text-left text-lg font-normal bg-blue-100 text-blue-800 focus:outline-none flex justify-between items-center font-luckiest-guy"
              >
                {faq.question}
                <span>{activeIndex === index ? "-" : "+"}</span>
              </button>
              <div
                className={`transition-max-height duration-300 ease-in-out overflow-hidden ${
                  activeIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="px-4 py-3 bg-white text-gray-700 border-t border-blue-200">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
