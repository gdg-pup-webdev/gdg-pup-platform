"use client";

import { Stack, Text } from "@packages/spark-ui";

export function IdInfoCard() {
    return (
        <div className="id-info-card backdrop-blur-md px-10 py-20 h-full flex flex-col justify-center">
            <Stack gap="lg" className="items-center">
                {/* When the solid color support has been added for text components, make sure to remoev the classname here and replace it with the new props. */}
                <Text variant="body" weight="normal" align="center" className="text-white">
                    How the GDG ID Platform Works
                </Text>

                <Text variant="body" className="text-white" align="center">
                    <span className="text-[#4285F4] font-bold">1. Apply for Membership</span><br />
                    Start by filling out the official GDG PUP membership application form.
                </Text>
                <Text variant="body" className="text-white" align="center">
                    <span className="text-[#F9AB00] font-bold">2. Receive your GDG ID</span><br />
                    Once accepted, your unique GDG ID is generated and assigned to you.
                </Text>
                <Text variant="body" className="text-white" align="center">
                    <span className="text-[#EA4335] font-bold">3. Find your GDG ID</span><br />
                    Easily locate your GDG ID by using the GDG ID Platform. Search it with your registered name or email address you’ve inputted in the application form.
                </Text>
                <Text variant="body" className="text-white" align="center">
                    <span className="text-[#34A853] font-bold">4. Use Across GDG Platforms</span><br />
                    Your GDG ID becomes your key to accessing future GDG PUP products, events, and community tools
                </Text>

            </Stack>
        </div>
    );
}
