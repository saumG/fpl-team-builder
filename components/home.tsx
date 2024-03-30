import Link from "next/link";
import React from "react";

export default function Home() {
  return (
    <div className="p-5 flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold">Welcome to Fantasy Team Builder!</h1>
      <p className="mt-3">
        Create your optimal fantasy team based on real-life player stats and
        performance metrics.
      </p>
      <Link
        href="/builder"
        className="mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Go to Team Builder
      </Link>
    </div>
  );
}
