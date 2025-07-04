import React from "react";
import Image from "next/image";

import { heroDetails } from "./data/hero";

const Hero: React.FC = () => {
  return (
    <section
      id="hero"
      className="relative flex place-content-evenly flex-row pb-0 pt-32 md:pt-40 px-5"
    >
      <div className="absolute left-0 top-0 bottom-0 -z-10 w-full">
        <div className="absolute inset-0 h-full w-full bg-hero-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"></div>
      </div>

      <div className="absolute left-0 right-0 bottom-0 "></div>
      <div className=" flex ">
        <Image
          src={heroDetails.centerImageSrc}
          width={184}
          height={140}
          quality={100}
          sizes="(max-width: 768px) 100vw, 384px"
          priority={true}
          unoptimized={true}
          alt="Ed3Lab arrow"
          className="relative mx-auto z-10"
        />
      </div>
      <div className="text-left">
        <h1 className="text-4xl md:text-6xl md:leading-tight font-bold text-foreground max-w-lg md:max-w-2xl mx-auto">
          Mintro
        </h1>
        <h4 className="text-3xl md:text-4xl md:leading-tight font-bold text-foreground max-w-lg md:max-w-1xl mx-auto">
          {" "}
          Mint your Intro to Trading
        </h4>
        <p className="mt-4 text-foreground max-w-lg mx-auto">
          {heroDetails.subheading}
        </p>
        {/*  <div className="mt-6 flex flex-col sm:flex-row items-center sm:gap-4 w-fit mx-auto">
                    <AppStoreButton dark />
                    <PlayStoreButton dark />
                </div> */}
      </div>
    </section>
  );
};

export default Hero;
//- Tailwind

//{ 'flame': { DEFAULT: '#e4572e', 100: '#311006', 200: '#61200d', 300: '#923113', 400: '#c34119', 500: '#e4572e', 600: '#e97b59', 700: '#ef9c82', 800: '#f4bdac', 900: '#faded5' }, 'verdigris': { DEFAULT: '#17bebb', 100: '#052626', 200: '#094c4b', 300: '#0e7271', 400: '#139996', 500: '#17bebb', 600: '#2ce5e2', 700: '#61ebe9', 800: '#96f2f0', 900: '#caf8f8' }, 'jonquil': { DEFAULT: '#ffc914', 100: '#372a00', 200: '#6e5400', 300: '#a57f00', 400: '#dca900', 500: '#ffc914', 600: '#ffd343', 700: '#ffde72', 800: '#ffe9a1', 900: '#fff4d0' }, 'raisin_black': { DEFAULT: '#2e282a', 100: '#090808', 200: '#131011', 300: '#1c1819', 400: '#252022', 500: '#2e282a', 600: '#5c5054', 700: '#89777d', 800: '#b0a4a8', 900: '#d8d2d4' }, 'kelly_green': { DEFAULT: '#76b041', 100: '#18230d', 200: '#2f461a', 300: '#476927', 400: '#5e8c34', 500: '#76b041', 600: '#91c561', 700: '#add389', 800: '#c8e2b0', 900: '#e4f0d8' } }
