import Link from "next/link";

export default function Header() {
  return (
    <nav className="bg-gray-800 p-3 text-white flex align-middle justify-center gap-6">
      <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium">
        Home
      </Link>
      <Link href="players" className="px-3 py-2 rounded-md text-sm font-medium">
        Players
      </Link>
      <Link href="teams" className="px-3 py-2 rounded-md text-sm font-medium">
        Teams
      </Link>
      <Link href="builder" className="px-3 py-2 rounded-md text-sm font-medium">
        Team Builder
      </Link>
    </nav>
  );
}
