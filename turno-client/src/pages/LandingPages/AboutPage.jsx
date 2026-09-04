import Button from '../../components/Button';
import logo from '../../assets/img/nubdexchange_logo.png';

const AboutPage = () => {
  return (
    <div className="flex w-full flex-col gap-6 bg-[#0A192F] font-['Outfit']">
      
      <section className="border-y border-white/10 bg-[#112240] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div className="rounded-3xl border border-white/10 bg-[#0F2C59] p-6">
            <div className="flex min-h-72 items-center justify-center rounded-[1.25rem] bg-[#0A192F]">
              <img 
                src={logo} 
                alt="BulldogEx" 
                className="h-32 w-32 rounded-full border-4 border-blue-900 bg-white object-contain shadow-md" 
              />
            </div>
          </div>

          <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.28em] text-yellow-500">
              About Store
            </p>
            <h1 className="max-w-xl text-3xl font-bold leading-tight text-white sm:text-4xl">
              A campus shop focused on useful products and simple ordering.
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-7 text-blue-200/60 sm:text-base font-medium">
              BulldogEx Shop keeps the low-fidelity layout system while presenting clear product categories, quick actions, and straightforward store information.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button to="/" variant="primary">
                Back Home
              </Button>
              <Button to="/products">Open Products</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#112240] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-yellow-500">
            Store Overview
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white">Quick store blocks</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[['08','Items'],['06','Categories'],['03','Pickup Slots'],['24','Orders']].map(([n, l]) => (
            <div key={l} className="rounded-3xl border border-white/10 bg-[#0F2C59] p-5 transition-all hover:border-[#F4B41A]/40">
              <p className="text-2xl font-black text-white">{n}</p>
              <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.24em] text-blue-300/60">{l}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#112240] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-yellow-500">
              Store Flow
            </p>
            <h2 className="mt-2 text-2xl font-bold text-white">Stacked shopping wireframe</h2>
            
            <div className="mt-6 space-y-4">
              <article className="rounded-3xl border border-white/10 border-l-4 border-l-[#F4B41A] bg-[#0F2C59] p-5 transition-all hover:shadow-md">
                <h3 className="text-lg font-bold text-white">Curated Catalog</h3>
                <p className="mt-3 text-sm leading-6 text-blue-200/60 font-medium">
                  Products are grouped by daily need so shoppers can scan faster.
                </p>
              </article>

              <article className="rounded-3xl border border-white/10 border-l-4 border-l-[#F4B41A] bg-[#0F2C59] p-5 transition-all hover:shadow-md">
                <h3 className="text-lg font-bold text-white">Simple Checkout</h3>
                <p className="mt-3 text-sm leading-6 text-blue-200/60 font-medium">
                  Product pages keep price, stock, and action buttons easy to find.
                </p>
              </article>

              <article className="rounded-3xl border border-white/10 border-l-4 border-l-[#F4B41A] bg-[#0F2C59] p-5 transition-all hover:shadow-md">
                <h3 className="text-lg font-bold text-white">Pickup Ready</h3>
                <p className="mt-3 text-sm leading-6 text-blue-200/60 font-medium">
                  Store information stays direct for students who need quick order updates.
                </p>
              </article>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#0F2C59] p-5 flex flex-col h-full">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-yellow-500">
              Category Grid
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 flex-grow">
              
              <div className="group relative aspect-square overflow-hidden rounded-[1.25rem] border-2 border-blue-900 bg-blue-100">
                <img 
                  src="https://varsitylifestyleco.com/cdn/shop/files/NU1_c809a5da-e148-4e16-95ce-8084f3150cca.jpg" 
                  alt="Daily Essentials" 
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition-colors" />
              </div>

              <div className="group relative aspect-square overflow-hidden rounded-[1.25rem] border-2 border-blue-900 bg-blue-100">
                <img 
                  src="https://anker.ph/cdn/shop/files/B2697J41_800x.png" 
                  alt="Study Supplies" 
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition-colors" />
              </div>

              <div className="group relative aspect-square overflow-hidden rounded-[1.25rem] border-2 border-blue-900 bg-blue-100">
                <img 
                  src="https://varsitylifestyleco.com/cdn/shop/files/NULanyard.jpg" 
                  alt="Campus Apparel" 
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition-colors" />
              </div>

              <div className="group relative aspect-square overflow-hidden rounded-[1.25rem] border-2 border-blue-900 bg-blue-100">
                <img 
                  src="https://hydroflask.ph/cdn/shop/files/2100313069_1_1024x1024.jpg?v=1761293661" 
                  alt="School Merch" 
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition-colors" />
              </div>

            </div>
            <Button to="/products" className="mt-5 w-full" variant="primary">View Products</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;