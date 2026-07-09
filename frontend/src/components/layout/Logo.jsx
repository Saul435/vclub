import { Clapperboard } from "lucide-react";

function Logo() {
  return (
    <div className="flex items-center gap-3 border-b border-zinc-800 pb-6">

      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600">

        <Clapperboard size={26} />

      </div>

      <div>

        <h1 className="text-xl font-bold tracking-wide">
          Video Club
        </h1>

      </div>

    </div>
  );
}

export default Logo;