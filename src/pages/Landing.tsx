import workshopOwnerPhoto from '../assets/workshop-owner.jpg'

const PHOTO_PAGE_URL =
  'https://commons.wikimedia.org/wiki/File:Blue_John_production_-_Pete_-_Andy_Mabbett_-_01.JPG'

export default function Landing({ onLogin }: { onLogin: () => void }) {
  return (
    <main className="landing-frame min-h-0 flex-1 overflow-y-auto">
      <div className="landing-panel mx-auto my-3 max-w-6xl rounded-[2rem] px-5 py-5 sm:my-6 sm:px-10 sm:py-7">
        <header className="flex items-center justify-between">
          <p className="font-display text-xl font-extrabold text-black">
            ToolLedger
          </p>
          <button
            type="button"
            className="btn btn-sm landing-login"
            onClick={onLogin}
          >
            Log in
          </button>
        </header>

        <section className="grid items-center gap-10 py-10 lg:grid-cols-2 lg:gap-6 lg:py-14">
          <div>
            <p>
              <span className="landing-badge">For workshops</span>
            </p>
            <h1 className="landing-headline font-display mt-5 font-extrabold">
              Know who has
              <br />
              your tools
            </h1>
            <p className="landing-sub mt-6 max-w-md">
              ToolLedger tracks every tool you lend out. Record each loan,
              spot overdue tools, and confirm returns — nothing forgotten.
            </p>
            <div className="mt-8">
              <button
                type="button"
                className="btn btn-lg landing-cta"
                onClick={onLogin}
              >
                Log in
                <span aria-hidden="true" className="landing-cta-arrow">
                  →
                </span>
              </button>
            </div>
          </div>

          <div className="photo-wrap">
            <div aria-hidden="true" className="photo-backdrop" />
            <img
              src={workshopOwnerPhoto}
              alt="Craftsman holding a rotary power tool in his workshop"
              className="photo-img"
            />
            <div aria-hidden="true" className="explore-badge">
              <svg viewBox="0 0 120 120" width="104" height="104">
                <defs>
                  <path
                    id="landing-badge-circle"
                    d="M60,60 m-45,0 a45,45 0 1,1 90,0 a45,45 0 1,1 -90,0"
                  />
                </defs>
                <text fontSize="11.5" fontWeight="700" fill="#0c1a12">
                  <textPath href="#landing-badge-circle">
                    RECORD • TRACK • RETURN •
                  </textPath>
                </text>
                <path
                  d="M60 46l3.5 10.5L74 60l-10.5 3.5L60 74l-3.5-10.5L46 60l10.5-3.5z"
                  fill="#0c1a12"
                />
              </svg>
            </div>
            <p className="photo-credit">
              Photo: <a href={PHOTO_PAGE_URL}>Andy Mabbett</a>, CC BY-SA 3.0,
              via Wikimedia Commons
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
