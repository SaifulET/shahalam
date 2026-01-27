import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="relative w-full h-60 md:h-60 overflow-hidden">
      {/* Hero Image */}
      <div className="absolute inset-0">
        <Image
          src="/hero.jpg"
          alt="Modern living room interior"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>
    </section>
  );
}