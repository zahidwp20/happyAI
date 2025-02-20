import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import styled from "styled-components";
import { useWeb3ModalAccount, useWeb3Modal } from "@web3modal/ethers/react";
import Logo from "./icons/Logo";
import Carousel from "./Marque";
import Section1 from "./Section1";

import BuyToken from "./icons/BuyToken";
import HeroImage from "./icons/HeroImage";


import HappyAi from "./HappyAi";
import { ethers } from "ethers";
import TokenomicSection from "./TokenomicSection";
import WhyChoose from "./WhyChoose";
import PlanSection from "./PlanSection";
import RoadMap from "./RoadMapHappy";
import Footer from "./Footer";
import Embark from "./Embark";
import FAQ from "./FAQ";
// Styled Components
const WalletButton = styled.button`
  background: #4285f4; /* Blue background */
  color: white;
  font-weight: bold;
  padding: 10px 25px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  letter-spacing: 1.1px;
  transform: skew(-15deg); /* Creates the skewed effect */
  transition: all 0.3s ease;

  &:hover {
    transform: skew(-15deg) scale(1.05); /* Slight scaling on hover */
    box-shadow: 0px 6px 12px rgba(66, 133, 244, 0.4);
  }

  &:active {
    transform: skew(-15deg) scale(0.95);
    box-shadow: 0px 4px 8px rgba(66, 133, 244, 0.3);
  }

  /* Text inside the button should be straight */
  span {
    display: inline-block;
    transform: skew(15deg);
  }

  ${({ isMobile }) =>
    isMobile
      ? `
    display: none;
    @media (max-width: 799px) {
      display: block;
    }
  `
      : `
    display: block;
    @media (max-width: 799px) {
      display: none;
    }
  `}
`;


const MobileMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px;
  background-color: #d4edf9;
  border: 4px solid #212529;
  border-radius: 25px;
  margin-top: 10px;
`;

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { open } = useWeb3Modal();
  const { isConnected, address } = useWeb3ModalAccount();

  return (
    <div className="px-4 md:px-10 lg:px-16 pt-5">
      {/* Header Container */}
      <div className="bg-[#D4EDF9] border-[4px] border-[#212529] rounded-[25px] h-[88px] flex items-center justify-between px-5 md:px-10">
        {/* Left: Logo */}
        <div className="flex items-center">
          <Logo />
          <Link to="#" className="ml-3 font-bold uppercase text-lg">
          Just a Happy Guy AI memecoin
          </Link>
        </div>

        {/* Middle: Menu (Desktop View) */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/Section1" className="font-bold hover:text-blue-600">
            Home
          </Link>
          <Link to="/TokenomicSection" className="font-bold hover:text-blue-600">
            About Us
          </Link>
          <Link to="/roadmap" className="font-bold hover:text-blue-600">
            Roadmap
          </Link>
          <Link to="/tokenomics" className="font-bold hover:text-blue-600">
            Tokenomics
          </Link>
          <Link to="/faq" className="font-bold hover:text-blue-600">
            FAQ
          </Link>
        </div>

        {/* Right: Connect Wallet */}
        <WalletButton
          isMobile={false}
          onClick={isConnected ? () => open("Account") : () => open("Connect")}
        >
          {isConnected
            ? `${address.substring(0, 4)}...${address.substring(
                address.length - 4
              )}`
            : "CONNECT WALLET"}
        </WalletButton>

        {/* Mobile Menu Toggle Button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <MobileMenuContainer>
          <Link
            to="/"
            className="font-bold hover:text-blue-600"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="font-bold hover:text-blue-600"
            onClick={() => setIsMenuOpen(false)}
          >
            About Us
          </Link>
          <Link
            to="/roadmap"
            className="font-bold hover:text-blue-600"
            onClick={() => setIsMenuOpen(false)}
          >
            Roadmap
          </Link>
          <Link
            to="/tokenomics"
            className="font-bold hover:text-blue-600"
            onClick={() => setIsMenuOpen(false)}
          >
            Tokenomics
          </Link>
          <Link
            to="/faq"
            className="font-bold hover:text-blue-600"
            onClick={() => setIsMenuOpen(false)}
          >
            FAQ
          </Link>

          {/* Mobile Wallet Button */}
          <WalletButton
            isMobile={true}
            onClick={isConnected ? () => open("Account") : () => open("Connect")}
          >
            {isConnected
              ? `${address.substring(0, 4)}...${address.substring(
                  address.length - 4
                )}`
              : "CONNECT WALLET"}
          </WalletButton>
        </MobileMenuContainer>
      )}
    </div>
  );
}
