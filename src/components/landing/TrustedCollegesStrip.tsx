import React from "react";

export function TrustedCollegesStrip() {
  return (
    <section aria-label="Trusted by leading colleges" className="w-full mt-6 mb-10">
      <div className="mx-auto max-w-[1440px] rounded-2xl border border-border/80 dark:bg-[#090e24]/70 bg-card/90 p-4 sm:p-5 backdrop-blur-xl shadow-md transition-colors">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Left Title */}
          <div className="shrink-0">
            <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-muted-foreground">
              TRUSTED BY LEADING COLLEGES
            </span>
          </div>

          {/* 6 Logos */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8 items-center justify-items-center w-full max-w-4xl opacity-80 hover:opacity-100 transition-opacity">
            {/* 1. SRM */}
            <div className="flex items-center gap-2">
              <div className="size-6 rounded-full border border-muted-foreground/60 grid place-items-center text-[10px] font-bold font-serif text-foreground/80">
                S
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-serif font-black tracking-wider text-xs text-foreground">SRM</span>
                <span className="text-[8px] tracking-widest text-muted-foreground uppercase">UNIVERSITY</span>
              </div>
            </div>

            {/* 2. VIT */}
            <div className="flex items-center gap-2">
              <div className="size-6 rounded-full border border-muted-foreground/60 grid place-items-center text-[9px] font-bold font-serif text-foreground/80">
                VIT
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-serif font-black text-sm text-foreground tracking-tight">VIT<sup className="text-[7px]">®</sup></span>
                <span className="text-[7px] text-muted-foreground uppercase leading-tight">Vellore Institute<br />of Technology</span>
              </div>
            </div>

            {/* 3. CHRIST */}
            <div className="flex items-center gap-2">
              <div className="size-6 rounded-full border border-muted-foreground/60 grid place-items-center text-[10px] font-bold font-serif text-foreground/80">
                ★
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-serif font-black text-xs text-foreground tracking-wider">CHRIST</span>
                <span className="text-[7px] text-muted-foreground uppercase">(Deemed to be University)</span>
              </div>
            </div>

            {/* 4. AMITY */}
            <div className="flex items-center gap-2">
              <div className="size-6 rounded-sm border border-muted-foreground/60 grid place-items-center text-[9px] font-bold font-serif text-foreground/80">
                A
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-serif font-black text-xs text-foreground tracking-wider">AMITY</span>
                <span className="text-[7px] text-muted-foreground uppercase">UNIVERSITY</span>
              </div>
            </div>

            {/* 5. LPU */}
            <div className="flex items-center gap-2">
              <div className="size-6 rounded-full border border-muted-foreground/60 grid place-items-center text-[9px] font-bold font-sans text-foreground/80">
                LPU
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-sans font-black text-xs text-foreground tracking-tight">LPU</span>
                <span className="text-[7px] text-muted-foreground uppercase leading-tight">Lovely Professional<br />University</span>
              </div>
            </div>

            {/* 6. JAIN */}
            <div className="flex items-center gap-2">
              <div className="size-6 rounded-full border border-muted-foreground/60 grid place-items-center text-[8px] font-bold font-sans text-foreground/80">
                JGI
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-sans font-black text-xs text-foreground tracking-wider">JAIN</span>
                <span className="text-[7px] text-muted-foreground uppercase">(Deemed-to-be University)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
