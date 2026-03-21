import Image from "next/image";


export function HomeBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute -top-24 inset-x-0 bottom-0 z-0 rounded-full">
      <div
        className="h-70 w-full"
        style={{
          background:
            "radial-gradient(124% 58% at 50% -7%, #FCFE79EF 0%, #FBFD86E6 12%, #F5F88CD9 26%, #ECEF99C7 40%, #D3D8A9A8 54%, #A9B09587 68%, #757C706B 81%, #334C5A52 91%, #050F1E00 100%)",
        }}
      />
      <div className="flex justify-center items-center">
        <Image 
          src="/ellipse 203.png"
          width={1002}
          height={321}
          alt="first ellipse"
          className="absolute w-auto top-30"
        >
        </Image>
        <Image 
          src="/ellipse 204.png"
          width={561}
          height={171}
          alt="second ellipse"
          className="mt-10"
        >
        </Image>
        <Image
          src="/Horizon.png"
          alt="horizon"
          width={2576}
          height={1342}
          className="absolute left-1/2 -translate-x-1/2 w-screen top-[60%]"
        >
        </Image>
      </div>
    </div>
  );
}