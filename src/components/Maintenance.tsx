/**
 * Maintenance page shown across every route when VITE_MAINTENANCE_MODE=true.
 * Renders before LandingPage / AppRoutes so users see the announcement first,
 * before accessing any normal app feature.
 *
 * Donation QR images (original, unmodified) must be placed at:
 *   public/images/donation/maybank-qr.jpeg
 *   public/images/donation/tng-ewallet-qr.jpeg
 * The QR images are referenced exactly as-is; they are not regenerated,
 * cropped, distorted, or recolored.
 */
export function Maintenance() {
  return (
    <div className="min-h-[100dvh] w-full bg-[#060816] text-[#F8FAFC] flex flex-col items-center justify-center px-6">
      <div className="mx-auto max-w-sm text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-amber-500 mb-6 mx-auto">
          <span className="text-2xl font-bold text-amber-400">!</span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          MyBertutur Is Temporarily Unavailable
        </h1>
        <p className="mt-4 text-lg text-slate-300 leading-relaxed">
          Sorry, MyBertutur will continue operating on Friday, 30 October 2026.
        </p>
        <p className="mt-4 text-base text-slate-400 leading-relaxed">
          We're sorry for the temporary interruption. We're working to bring
          MyBertutur back as soon as possible. Please check back on Friday, 30
          October 2026.
        </p>

        {/* Support MyBertutur — donation QR cards */}
        <section className="mt-10 w-full">
          <h2 className="mb-6 text-xl font-bold text-white">Support MyBertutur</h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="flex flex-col items-center justify-center p-6 rounded-2xl border border-slate-700 bg-[#070b18]/40">
              <div className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">
                Maybank
              </div>
              <img
                src="/images/donation/maybank-qr.jpeg"
                alt="Maybank QR code for donations to Megat Rashidi Bin Mohd Ra"
                className="w-[220px] h-[220px] md:w-[300px] md:h-[300px] rounded-xl bg-white p-3 object-contain drop-shadow-lg"
              />
              <p className="mt-3 text-sm font-medium text-slate-300 text-center leading-tight">
                Megat Rashidi Bin Mohd Ra
              </p>
              <p className="mt-2 text-xs text-slate-500 text-center leading-tight">
                Open your banking app or eWallet and scan the QR code.
              </p>
            </div>
            <div className="flex flex-col items-center justify-center p-6 rounded-2xl border border-slate-700 bg-[#070b18]/40">
              <div className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">
                Touch ’n Go eWallet
              </div>
              <img
                src="/images/donation/tng-ewallet-qr.jpeg"
                alt="Touch ’n Go eWallet QR code for donations to Megat Rashidi Bin Mohd Radzi"
                className="w-[220px] h-[220px] md:w-[300px] md:h-[300px] rounded-xl bg-white p-3 object-contain drop-shadow-lg"
              />
              <p className="mt-3 text-sm font-medium text-slate-300 text-center leading-tight">
                Megat Rashidi Bin Mohd Radzi
              </p>
              <p className="mt-2 text-xs text-slate-500 text-center leading-tight">
                Open your banking app or eWallet and scan the QR code.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
