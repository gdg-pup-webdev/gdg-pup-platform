import Image from "next/image";
import { ASSETS } from "@/lib/constants/assets";

export function HomeBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -top-24 inset-x-0 bottom-0 z-0 rounded-full "
    >
      <div
        className="h-70 w-full"
        style={{
          background:
            "radial-gradient(124% 58% at 50% -7%, #FCFE79EF 0%, #FBFD86E6 12%, #F5F88CD9 26%, #ECEF99C7 40%, #D3D8A9A8 54%, #A9B09587 68%, #757C706B 81%, #334C5A52 91%, #010B1D 100%)",
        }}
      />
      <div className="flex justify-center items-center">
        {/* ======================= */}
        {/*        STARS            */}
        {/* ======================= */}
        <Image
          src={ASSETS.HOME.STARS1}
          width={1108}
          height={1108}
          alt="stars"
          draggable={false}
          className="pointer-events-none select-none hidden lg:block absolute w-auto  top-500 -right-30"
        />
        <Image
          src={ASSETS.HOME.STARS2}
          width={260}
          height={310}
          alt="stars"
          draggable={false}
          className="pointer-events-none select-none hidden lg:block absolute w-auto top-267 left-35"
        />
        <Image
          src={ASSETS.HOME.STARS3}
          width={259}
          height={311}
          alt="stars"
          draggable={false}
          className="pointer-events-none select-none hidden lg:block absolute w-auto top-80 right-30"
        />
        <Image
          src={ASSETS.HOME.STARS4}
          width={259}
          height={310}
          alt="stars"
          draggable={false}
          className="pointer-events-none select-none hidden lg:block absolute w-auto top-50 left-120 "
        />
        <Image
          src={ASSETS.HOME.STARS5}
          width={259}
          height={310}
          alt="stars"
          draggable={false}
          className="pointer-events-none select-none hidden lg:block absolute w-auto top-300 left-110 "
        />
        <Image
          src={ASSETS.HOME.STARS6}
          width={260}
          height={311}
          alt="stars"
          draggable={false}
          className="pointer-events-none select-none hidden lg:block absolute w-auto top-235 right-100 "
        />
        <Image
          src={ASSETS.HOME.STARS6}
          alt="space dust"
          width={1403}
          height={1403}
          draggable={false}
          className="pointer-events-none select-none absolute hidden lg:block top-1100 right-0 w-auto"
        />
        <Image
          src={ASSETS.HOME.STARS6}
          alt="space dust"
          width={1403}
          height={1403}
          draggable={false}
          className="pointer-events-none select-none absolute hidden lg:block top-1300 left-[20%] w-auto"
        />
        <Image
          src={ASSETS.HOME.STARS6}
          alt="space dust"
          width={1403}
          height={1403}
          draggable={false}
          className="pointer-events-none select-none absolute hidden lg:block top-1400 left-[30%] w-auto"
        />
        <Image
          src={ASSETS.HOME.STARS6}
          alt="space dust"
          width={1403}
          height={1403}
          draggable={false}
          className="pointer-events-none select-none absolute hidden lg:block top-1325 right-[20%] w-auto"
        />
        {/* ======================= */}
        {/*       ELLIPSES          */}
        {/* ======================= */}
        <Image
          src={ASSETS.HOME.ELLIPSE203}
          width={1002}
          height={321}
          alt="first ellipse"
          draggable={false}
          className="pointer-events-none select-none absolute w-auto top-30"
        />
        <Image
          src={ASSETS.HOME.ELLIPSE204}
          width={561}
          height={171}
          alt="second ellipse"
          draggable={false}
          className="pointer-events-none select-none mt-10"
        />
        <Image
          src={ASSETS.HOME.ELLIPSE205}
          width={1273}
          height={143}
          alt="bottom inner ellipse"
          draggable={false}
          className="pointer-events-none select-none absolute w-auto bottom-30 hidden lg:block"
        />

        {/* ======================= */}
        {/*      SPACE DUST         */}
        {/* ======================= */}
        <Image
          src={ASSETS.HOME.SPACE_DUST_BLUE1}
          alt="space dust"
          width={1403}
          height={1403}
          draggable={false}
          className="pointer-events-none select-none absolute hidden lg:block -top-67 left-0 w-150"
        />
        <Image
          src={ASSETS.HOME.SPACE_DUST_BLUE3}
          alt="space dust"
          width={1403}
          height={1403}
          draggable={false}
          className="pointer-events-none select-none absolute top-167 hidden lg:block right-0 w-120"
        />
        <Image
          src={ASSETS.HOME.SPACE_DUST_BLUE1}
          alt="space dust"
          width={1403}
          height={1403}
          draggable={false}
          className="pointer-events-none select-none absolute hidden lg:block top-1000 left-0 w-150"
        />
        <Image
          src={ASSETS.HOME.SPACE_DUST_BLUE3}
          alt="space dust"
          width={1403}
          height={1403}
          draggable={false}
          className="pointer-events-none select-none absolute top-1200 hidden lg:block right-0 w-120"
        />

        {/* ======================= */}
        {/*   HORIZON & SPIRAL      */}
        {/* ======================= */}
        <Image
          src={ASSETS.HOME.HORIZON}
          alt="horizon"
          width={2576}
          height={1342}
          draggable={false}
          className="pointer-events-none select-none absolute left-1/2 hidden lg:block -translate-x-1/2 w-screen top-750"
        />
        <Image
          src={ASSETS.HOME.SPIRAL}
          width={1504}
          height={182}
          alt="bottom outer ellipse"
          draggable={false}
          className="pointer-events-none select-none absolute w-auto bottom-20 z-0 hidden lg:block"
        />

        {/* ======================= */}
        {/*    AMBIENT GLOWS        */}
        {/* ======================= */}
        <div className="hidden lg:block w-154.25 h-156 bg-[#FF7DAF4D] absolute -top-10 -right-70 opacity-30  rounded-full blur-[400px]" />
        <div className="hidden lg:block w-300 h-300 bg-[#FF7DAF4D] absolute top-500 -right-100 opacity-40 z-20 rounded-full blur-[100px]" />
        <div className="hidden lg:block w-300 h-300 bg-[#57caff29] absolute top-500 -left-100 opacity-40 z-20 rounded-full blur-[100px]" />
        <div className="hidden lg:block w-150 h-150 bg-[#57caff29] absolute top-1450 right-[40%] opacity-40 z-20 rounded-full blur-[100px]" />
        <div className="hidden lg:block absolute top-200 opacity-15 -left-[20%] w-186 h-88 bg-[#57CAFF29] rounded-full blur-[100px]" />
        <div className="hidden lg:block w-154.25 h-156 bg-[#FF7DAF4D] absolute top-1050 -right-20 opacity-40 z-20 rounded-full blur-[100px]" />
      </div>
    </div>
  );
}
