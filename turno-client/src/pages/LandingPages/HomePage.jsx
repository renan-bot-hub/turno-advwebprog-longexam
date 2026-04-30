import Button from '../../components/Button';
import banner from '../../assets/img/nu_bulldogex_banner.jpg';

const HomePage = () => {
  return (
    <div className="flex w-full flex-col gap-6 bg-slate-50 font-['Outfit']">
      
      <section className="relative min-h-[28rem] overflow-hidden border-y-2 border-blue-900 bg-blue-900 px-4 py-10 sm:px-6 lg:px-8">
        <img
          src={banner}
          alt="NU BulldogEx Banner"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 hover:scale-105"
        />
        <div className="absolute inset-0 bg-blue-900/60" />

        <div className="relative z-10 flex min-h-[22rem] items-start justify-end text-right sm:min-h-[24rem]">
          <div className="max-w-xl">
            <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.28em] text-yellow-400 drop-shadow-sm">
              Campus Marketplace
            </p>
            <h1 className="text-3xl font-black leading-tight text-white sm:text-5xl drop-shadow-md">
              Welcome to BulldogEx Shop
            </h1>
            <p className="mt-4 text-sm font-medium leading-7 text-blue-50 sm:text-base drop-shadow-sm">
              Explore campus uniforms, student essentials, and school merch in one quick storefront.
            </p>
            <div className="mt-8 flex flex-wrap justify-end gap-3">
              <Button to="/products">
                Shop Now
              </Button>
              <Button to="/about" variant="primary">
                About Store
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y-2 border-blue-900 bg-white px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-yellow-500">
            Store Overview
          </p>
          <h2 className="mt-2 text-2xl font-bold text-blue-900 sm:text-3xl">Quick shopping blocks</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Products', val: '08' },
            { label: 'Categories', val: '06' },
            { label: 'Orders', val: '24' },
            { label: 'Pickup Slots', val: '03' }
          ].map((stat) => (
            <div key={stat.label} className="group rounded-[2rem] border-2 border-blue-900 border-b-4 bg-slate-50 p-6 transition-all hover:border-b-yellow-400 hover:bg-white shadow-sm">
              <p className="text-xl font-black text-blue-900 group-hover:scale-95 transition-transform duration-300">
                {stat.val}
              </p>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y-2 border-blue-900 bg-white px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-yellow-500">
            Shop Sections
          </p>
          <h2 className="mt-2 text-2xl font-bold text-blue-900">Simple store cards</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          
          {/* Daily Essentials */}
          <article className="group rounded-[2.5rem] border-2 border-blue-900 bg-slate-50 p-5 transition-all hover:border-yellow-400 hover:shadow-xl">
            <div className="flex aspect-4/3 items-center justify-center overflow-hidden rounded-[1.5rem] bg-slate-200 border border-blue-100">
              <img 
                src="https://varsitylifestyleco.com/cdn/shop/files/NULanyard.jpg" 
                alt="Daily Essentials" 
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <h3 className="mt-5 text-xl font-bold text-blue-900">Daily Essentials</h3>
            <p className="mt-3 text-sm font-medium leading-relaxed text-slate-600">
              Bags, tumblers, lanyards, and items used every school day.
            </p>
            <Button to="/products" className="mt-6 w-full justify-center" variant="primary">View Products</Button>
          </article>

          {/* Study Supplies */}
          <article className="group rounded-[2.5rem] border-2 border-blue-900 bg-slate-50 p-5 transition-all hover:border-yellow-400 hover:shadow-xl">
            <div className="flex aspect-4/3 items-center justify-center overflow-hidden rounded-[1.5rem] bg-slate-200 border border-blue-100">
              <img 
                src="https://ecommerce.datablitz.com.ph/cdn/shop/files/dfbfdb_1dfa5b1d-0153-4b2c-b91d-f6dba679d87f_1024x.jpg?v=1703065790" 
                alt="Study Supplies" 
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <h3 className="mt-5 text-xl font-bold text-blue-900">Study Supplies</h3>
            <p className="mt-3 text-sm font-medium leading-relaxed text-slate-600">
              Notes, desk tools, and study kits for class and review weeks.
            </p>
            <Button to="/products" className="mt-6 w-full justify-center" variant="primary">Shop Supplies</Button>
          </article>

          {/* Campus Apparel */}
          <article className="group rounded-[2.5rem] border-2 border-blue-900 bg-slate-50 p-5 transition-all hover:border-yellow-400 hover:shadow-xl">
            <div className="flex aspect-4/3 items-center justify-center overflow-hidden rounded-[1.5rem] bg-slate-200 border border-blue-100">
              <img 
                src="https://ph-live-01.slatic.net/p/mdc/dc6f40dc1118bce32be03e63248b19e2.jpg" 
                alt="Campus Apparel" 
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <h3 className="mt-5 text-xl font-bold text-blue-900">Campus Apparel</h3>
            <p className="mt-3 text-sm font-medium leading-relaxed text-slate-600">
              Comfortable pieces for class days, commute days, and weekends.
            </p>
            <Button to="/products" className="mt-6 w-full justify-center" variant="primary">View Apparel</Button>
          </article>

        </div>
      </section>
    </div>
  );
};

export default HomePage;