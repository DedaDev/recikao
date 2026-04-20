export function CtaBanner() {
  return (
    <section className="px-6 md:px-14 py-16 md:py-20 bg-gradient-to-br from-[#2e1065] to-[#4c1d95]">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <h2 className="font-oswald text-3xl md:text-4xl uppercase text-white tracking-[-0.01em]">
            Spreman da počneš?
          </h2>
          <p className="mt-2 text-sm font-nunito text-white/45">
            Besplatno, bez instalacije. Prijavi se i kreni.
          </p>
        </div>
        <a
          href="/app"
          className="font-oswald text-sm tracking-[0.15em] uppercase shrink-0 text-text-voice bg-surface px-8 py-3.5 rounded-lg no-underline inline-block transition-colors hover:bg-[#1a1430]"
        >
          Probaj odmah →
        </a>
      </div>
    </section>
  );
}
