import { Landmark } from "lucide-react";

interface DebitCardProps {
  cardNumber?: string;
  cardHolder?: string;
  expiry?: string;
  status?: string;
}

export function DebitCard({
  cardNumber = "**** **** **** ****",
  cardHolder = "CARD HOLDER",
  expiry = "MM/YY",
  status = "ACTIVE",
}: DebitCardProps) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#2d6a4f] via-[#3a7d5c] to-[#1b4332] p-4 text-card shadow-xl sm:p-6">
      {/* Decorative circles */}
      <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-[#ffffff08]" />
      <div className="absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-[#ffffff06]" />

      <div className="relative flex h-75 flex-col justify-between">
        {/* Top Row */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Landmark className="h-5 w-5 text-card" />
            <span className="text-base font-bold text-card">NIGUS Bank</span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-card/70">
              {status} Card
            </span>
            <div className="h-8 w-10 rounded-md bg-chart-4 shadow-md" />
          </div>
        </div>

        {/* Card Number */}
        <p className="font-mono text-base font-medium tracking-[0.15em] text-card sm:text-xl sm:tracking-[0.2em] md:text-2xl">
          {cardNumber}
        </p>

        {/* Bottom Row */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-card/70">
              Card Holder
            </p>
            <p className="text-sm font-bold text-card">{cardHolder}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-card/70">
              Expires
            </p>
            <p className="text-sm font-bold text-card">{expiry}</p>
          </div>
          {/* Mastercard Logo */}
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-[#eb001b] opacity-90" />
            <div className="-ml-3 h-8 w-8 rounded-full bg-chart-4 opacity-80" />
          </div>
        </div>
      </div>
    </div>
  );
}