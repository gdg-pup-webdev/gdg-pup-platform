"use client";

import { callEndpoint } from "@packages/api-typing";
import { webdevApiContract } from "@packages/webdev-api-contracts";
import Link from "next/link";

const page = () => {
  const fetchApi = async () => {
    const result = await callEndpoint(
      process.env.NEXT_PUBLIC_API_BASE_URL!,
      webdevApiContract.questionSystem.questions.post,
      {
        body: {
          question: "a",
          answer: 0,
          option_a: "a",
          option_b: "b",
          value: 10,
          schedule: "2026-03-01",
        },
      }
    );

    if (result.status === 201) {
      // TS knows 'result.body' is the Question Resource
      console.log("Created Question:", result.body);
    } else if (result.status === 400) {
      // TS knows 'result.body' is the Error object
      console.error("Validation Error:", result.body.message);
    }
  };

  return (
    <>
      <div>Home page</div>
      <button className="p-2 border bg-blue-200 rounded-2xl" onClick={fetchApi}>
        test api
      </button>
    </>
  );
};

export default page;
