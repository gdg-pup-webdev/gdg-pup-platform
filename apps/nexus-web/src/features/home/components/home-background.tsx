import Image from "next/image";
import { ASSETS } from "@/lib/constants/assets";

export function HomeBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute -top-24 inset-x-0 bottom-0 z-0 rounded-full ">
      <div
        className="h-70 w-full"
        style={{
          background:
            "radial-gradient(124% 58% at 50% -7%, #FCFE79EF 0%, #FBFD86E6 12%, #F5F88CD9 26%, #ECEF99C7 40%, #D3D8A9A8 54%, #A9B09587 68%, #757C706B 81%, #334C5A52 91%, #010B1D 100%)",
        }}
      />
      <div className="flex justify-center items-center">
        <Image 
          src={ASSETS.HOME.ELLIPSE203}
          width={1002}
          height={321}
          alt="first ellipse"
          className="absolute w-auto top-30"
        >
        </Image>
        <Image 
          src={ASSETS.HOME.STARS1}
          width={1108}
          height={1108}
          alt="stars"
          className="hidden lg:block absolute w-auto  top-500 -right-30"
        >
        </Image>
        <Image 
          src={ASSETS.HOME.STARS2}
          width={260}
          height={310}
          alt="stars"
          className="hidden lg:block absolute w-auto top-267 left-35"
        >
        </Image>
        <Image 
          src={ASSETS.HOME.STARS3}
          width={259}
          height={311}
          alt="stars"
          className="hidden lg:block absolute w-auto top-80 right-30"
        >
        </Image>
        <Image 
          src={ASSETS.HOME.STARS4}
          width={259}
          height={310}
          alt="stars"
          className="hidden lg:block absolute w-auto top-50 left-120 "
        ></Image>
        <Image 
          src={ASSETS.HOME.STARS5}
          width={259}
          height={310}
          alt="stars"
          className="hidden lg:block absolute w-auto top-300 left-110 "
        ></Image>
        <Image 
          src={ASSETS.HOME.STARS6}
          width={260}
          height={311}
          alt="stars"
          className="hidden lg:block absolute w-auto top-235 right-100 "
        ></Image>
<div className="hidden lg:block w-154.25 h-156 bg-[#FF7DAF4D] absolute -top-10 -right-70 opacity-30  rounded-full blur-[400px]" />
        <Image 
          src={ASSETS.HOME.ELLIPSE204}
          width={561}
          height={171}
          alt="second ellipse"
          className="mt-10"
        >
        </Image>
      <div className="hidden lg:block w-154.25 h-156.25 bg-[#4285F440] opacity-100 -left-67 top-520 absolute rounded-full blur-[400px]" />
        <Image
          src={ASSETS.HOME.SPACE_DUST_BLUE2}
          alt="space dust"
          width={1403}
          height={1403}
          className="absolute hidden lg:block top-450 left-0 w-auto"
        ></Image>
        <Image
          src={ASSETS.HOME.SPACE_DUST_BLUE12}
          alt="space dust"
          width={1403}
          height={1403}
          className="absolute hidden lg:block top-650 right-0 w-auto"
        ></Image>
        <Image
          src={ASSETS.HOME.SPACE_DUST_BLUE1}
          alt="space dust"
          width={1403}
          height={1403}
          className="absolute hidden lg:block top-67 left-0 w-auto"
        ></Image>
        <div className="hidden lg:block absolute top-200 opacity-15 -left-[20%] w-186 h-88 bg-[#57CAFF29] rounded-full blur-[400px]" />
        <Image
        src={ASSETS.HOME.SPACE_DUST_BLUE3}
        alt="space dust"
          width={1403}
          height={1403}
          className="w-auto absolute top-240 hidden lg:block right-0"
        >
        </Image>
        <div className="hidden lg:blockw-185.75 h-188 bg-[#FF7DAF4D] absolute top-480 -right-100 opacity-30 rounded-full blur-[400px]" />
        <Image
          src={ASSETS.HOME.HORIZON}
          alt="horizon"
          width={2576}
          height={1342}
          className="absolute left-1/2 hidden lg:block -translate-x-1/2 w-screen top-[60%]"
        >
        </Image>
        <Image 
          src={ASSETS.HOME.ELLIPSE208}
          width={1273}
          height={143}
          alt="bottom inner ellipse"
          className="absolute w-auto bottom-30 hidden lg:block"
        >
        </Image>
        <Image 
          src={ASSETS.HOME.SPIRAL}
          width={1504}
          height={182}
          alt="bottom outer ellipse"
          className="absolute w-auto bottom-20 z-0 hidden lg:block"
        >
        </Image>
      </div>
    </div>
  );
}