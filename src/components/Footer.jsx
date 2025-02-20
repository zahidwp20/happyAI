import React from "react";
import FooterLogo from "./icons/FooterLogo";
import { Link } from "react-router-dom";
import EmailIcon from "./icons/EmailIcon";
import XIcon from "./icons/XIcon";
import ArrowUp from "./icons/ArrowUp";

export default function Footer () {
  return (
    <div className="flex justify-center">
      <div className="w-[1145px] px-8 md:px-0">
        <div className="flex justify-center">
          <FooterLogo />
        </div>
        <div className="flex justify-center mt-10">
          <div className="flex items-center gap-6">
            <Link href="#">
              <div className="">Home</div>
            </Link>
            <Link href="#">
              <div className="">About</div>
            </Link>
            <Link href="#">
              <div className="">Roadmap</div>
            </Link>
            <Link href="#">
              <div className="">Faq</div>
            </Link>
          </div>
        </div>

        {/*  */}
        <div className="mt-[27px] flex justify-center gap-[46px]">
          <div className="flex gap-[14px] items-center">
            <EmailIcon />
            <div className="font-semibold text-black">E-mail</div>
          </div>
          <div className="flex gap-[14px] items-center">
            <XIcon />
            <div className="font-semibold text-black">Twitter</div>
          </div>
        </div>

        {/*  */}
        <div className="flex flex-col-reverse items-center md:flex-row justify-between mt-6 border-t border-t-black py-8">
          <p className="text-base text-center text-black mt-5 md:mt-0">
            © 2025 Just a happy guy AI. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="#">
              <div className="">Privacy policy</div>
            </Link>
            <Link href="#">
              <div className="">Terms of use</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
