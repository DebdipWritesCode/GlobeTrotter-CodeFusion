import { features, featuresHeaders } from "@/constants/landing";

export default function Feature1() {
  return (
    <section className="relative py-14 ">
      <div className="mx-auto max-w-screen-xl px-4 md:px-8">
        <div className="relative mx-auto max-w-2xl sm:text-center">
          <div className="relative z-10">
            <h3 className="font-geist mt-4 text-3xl font-normal tracking-tighter sm:text-4xl md:text-5xl">
              {featuresHeaders.title}
            </h3>
            <p className="font-geist text-foreground/60 mt-3">
              {featuresHeaders.subtitle}
            </p>
          </div>
          <div
            className="absolute inset-0 mx-auto h-44 max-w-xs blur-[118px]"
            style={{
              background:
                "linear-gradient(152.92deg, rgba(var(--primary-rgb), 0.2) 4.54%, rgba(var(--primary-rgb), 0.26) 34.2%, rgba(var(--primary-rgb), 0.1) 77.55%)",
            }}></div>
        </div>
        <hr className="bg-foreground/30 mx-auto mt-5 h-px w-1/2" />
        <div className="relative mt-12">
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((item, idx) => (
              <li
                key={idx}
                className="transform-gpu space-y-3 rounded-xl border bg-transparent p-4 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.18)_inset]">
                <div className="text-primary w-fit transform-gpu rounded-full border p-4 [box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.25)_inset] dark:[box-shadow:0_-20px_80px_-20px_rgba(var(--primary-rgb),0.06)_inset]">
                  <item.icon
                    className="h-6 w-6 text-primary"
                    aria-hidden="true"
                  />
                </div>
                <h4 className="font-geist text-lg font-bold tracking-tighter">
                  {item.title}
                </h4>
                <p className="text-gray-500">{item.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
