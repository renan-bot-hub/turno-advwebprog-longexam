import { useParams } from 'react-router-dom';
import Button from '../../components/Button.jsx';
import products from '../../assets/product-content.js';

function ProductPage() {
  const { name } = useParams();
  const product = products.find(product => product.name === name);

  if (!product) {
    return (
      <div className="flex w-full flex-col gap-6 bg-slate-50 font-['Outfit'] min-h-[70vh]">
        <section className="border-y-2 border-blue-900 bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold text-blue-900">Product not found</h1>
          <div className="mt-8">
            <Button to="/products" variant="primary">Back to Products</Button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6 bg-slate-50 font-['Outfit']">
      {/* Header Section */}
      <section className="border-y-2 border-blue-900 bg-white px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6">
            <Button to="/products" className="text-sm font-bold">&larr; Back to Products</Button>
          </div>
          <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.28em] text-yellow-500">
            {product.category}
          </p>
          <h1 className="text-3xl font-black leading-tight text-blue-900 sm:text-4xl lg:text-5xl tracking-tight">
            {product.title}
          </h1>
        </div>
      </section>

      {/* Image Section with Fixed Zoom */}
      <section className="border-y-2 border-blue-900 bg-white px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mx-auto max-w-3xl">
          
          {/* 
            FIX: 'group' handles the hover trigger, 
            'overflow-hidden' clips the image so it doesn't overlap borders.
          */}
          <div className="group relative mb-10 aspect-square sm:aspect-video w-full overflow-hidden rounded-3xl border-4 border-blue-900 bg-slate-100 shadow-lg">
            <img 
              src={product.imageUrl} 
              alt={product.title} 
              className="h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
            />
            
            {/* Subtle blue tint overlay on hover */}
            <div className="absolute inset-0 bg-blue-900/0 transition-colors duration-300 group-hover:bg-blue-900/5" />
          </div>

          {/* Details Section */}
          <div className="prose prose-sm max-w-none space-y-5">
            {product.content.map((paragraph, index) => (
              <p key={index} className="text-base font-medium leading-relaxed text-slate-600">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4 border-t-2 border-slate-200 pt-8">
             <div className="rounded-md bg-yellow-400 px-6 py-2 text-xl font-black text-blue-900 shadow-sm">
              {product.price}
            </div>
            <Button 
              className="border-2 border-blue-900 bg-blue-900 text-yellow-400 px-8 py-3 font-extrabold shadow-md hover:bg-yellow-400 hover:text-blue-900 hover:border-yellow-400 transition-all"
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProductPage;