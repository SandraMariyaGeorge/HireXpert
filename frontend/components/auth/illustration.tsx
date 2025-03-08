import Image from "next/image";

export function Illustration() {
  return (
    <div className="relative w-full h-[400px]">
      <Image
        src="/recycling.svg"
        alt="Recycling illustration"
        fill
        className="object-contain"
        priority
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
        <h2 className="text-2xl font-bold">Promote Recycling, Save the Planet</h2>
        <p className="mt-2 text-slate-600 max-w-md">
          Join the movement to recycle and change the mindset of people in Singapore. Start recycling today and make a difference.
        </p>
      </div>
    </div>
  );
}