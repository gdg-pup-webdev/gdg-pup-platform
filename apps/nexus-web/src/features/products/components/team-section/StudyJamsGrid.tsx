import { Stack, Text } from "@packages/spark-ui";
import { StudyJamContainer } from "../StudyJamContainer";

export function StudyJamsGrid() {
  return (
    <Stack gap="xl" className="mt-16">
      <Text
        variant="heading-1"
        gradient="white-blue"
        align="center"
        weight="bold"
      >
        STUDY JAMS
      </Text>

      <div className="w-full flex flex-col md:flex-row flex-wrap gap-6 items-center md:items-stretch justify-center">
        {[1, 2, 3].map((i) => (
          <StudyJamContainer
            key={i}
            className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-[340px]"
            imageSrc="/products/iot_study_jam_image.jpg"
            imageAlt={`Study Jam ${i}`}
            title="Design Smarter, Prototype Faster"
            subtitle="Rosemarie Aspa"
            description="This hands-on session will teach you how to create parametric sketches, apply accurate dimensions and constraints, and seamlessly convert 2D drawings ..."
            category={
              <>
                <span className="inline-flex items-center rounded-full bg-[#8B2F00]/90 px-3 py-1 text-[11px] font-medium leading-none text-white">
                  IOT
                </span>
                <span className="inline-flex items-center rounded-full bg-[#B67853]/90 px-3 py-1 text-[11px] font-medium leading-none text-white">
                  Prototype
                </span>
                <span className="inline-flex items-center rounded-full bg-[#7E6A63]/90 px-3 py-1 text-[11px] font-medium leading-none text-white">
                  3D Models
                </span>
              </>
            }
            date="02/27/26"
          />
        ))}
      </div>
    </Stack>
  );
}
