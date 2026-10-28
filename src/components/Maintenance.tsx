/**
 * Maintenance page shown across every route when VITE_MAINTENANCE_MODE=true.
 * Renders before LandingPage / AppRoutes so users see the announcement first,
 * before accessing any normal app feature. No donation QR codes are included.
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
      </div>
    </div>
  );
}
