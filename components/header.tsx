"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  return (
    <ul className="p-2 flex flex-wrap justify-center text-sm font-medium text-center text-[#CBD5E1] border-b border-[#22354C]">
      <li className="mr-8">
        <Link
          href="/"
          className={`inline-block py-2 px-4 rounded-t-lg ${
            pathname === "/"
              ? "text-white bg-blue-500"
              : "hover:text-gray-600 hover:bg-gray-50"
          }`}
        >
          Home
        </Link>
      </li>
      <li className="mr-8">
        <Link
          href="/players"
          className={`inline-block py-2 px-4 rounded-t-lg ${
            pathname === "/players"
              ? "text-white bg-blue-500"
              : "hover:text-gray-600 hover:bg-gray-50"
          }`}
        >
          Players
        </Link>
      </li>
      <li className="mr-8">
        <Link
          href="/teams"
          className={`inline-block py-2 px-4 rounded-t-lg ${
            pathname === "/teams"
              ? "text-white bg-blue-500"
              : "hover:text-gray-600 hover:bg-gray-50"
          }`}
        >
          Teams
        </Link>
      </li>
    </ul>
  );
}
