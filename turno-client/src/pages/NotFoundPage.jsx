import Button from '../components/Button';

const NotFoundPage = () => {
  return (
    <div className="flex w-full flex-col gap-6 bg-[#0A192F]">
      
      {/* 404 Hero Section */}
      <section className="border-y border-white/10 bg-[#112240] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-[12px] font-extrabold uppercase tracking-[0.2em] text-yellow-500 drop-shadow-sm">
            Error
          </p>
          <h1 className="text-7xl font-black leading-tight text-white sm:text-8xl lg:text-9xl">
            404
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-lg font-medium leading-relaxed text-blue-200/80">
            Page not found. The page you're looking for doesn't exist or has wandered out of bounds.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button 
              to="/" 
              className="border-2 border-yellow-400 bg-yellow-400 text-blue-900 hover:bg-blue-900 hover:text-yellow-400 transition-colors shadow-sm font-bold"
            >
              Back Home
            </Button>
            <Button to="/products">
              View Products
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="border-y border-white/10 bg-[#112240] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center sm:text-left">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-yellow-500">
              Quick Links
            </p>
            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Explore the site</h2>
          </div>
          
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Home Card */}
            <div className="group rounded-3xl border-2 border-blue-900 bg-[#0A192F] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-yellow-400 hover:shadow-lg">
                <h3 className="text-xl font-bold text-white transition-colors group-hover:text-[#F4B41A]">Home</h3>
                <p className="mt-2 text-sm leading-6 text-blue-200/80">Return to the BulldogEx homepage to start over.</p>
              <div className="mt-5">
                <Button to="/">Go Home</Button>
              </div>
            </div>
            
            {/* Products Card */}
            <div className="group rounded-3xl border-2 border-blue-900 bg-[#0A192F] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-yellow-400 hover:shadow-lg">
                <h3 className="text-xl font-bold text-white transition-colors group-hover:text-[#F4B41A]">Products</h3>
                <p className="mt-2 text-sm leading-6 text-blue-200/80">Browse all featured campus uniforms and essentials.</p>
              <div className="mt-5">
                <Button to="/products">View Products</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default NotFoundPage;