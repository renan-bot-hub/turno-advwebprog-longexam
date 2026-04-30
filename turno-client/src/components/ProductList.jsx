import { Link } from 'react-router-dom';

const ProductList = ({ products }) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 font-['Outfit']">
      {products.map((product) => (
        <Link
          key={product.name}
          to={`/products/${product.name}`}
          className="group relative flex flex-col justify-between rounded-3xl border-2 border-blue-900 bg-white p-5 transition-all duration-300 hover:-translate-y-2 hover:border-yellow-400 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 active:scale-95"
        >
          <div>
            <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[1.25rem] border-2 border-blue-100 bg-slate-50 transition-colors group-hover:border-yellow-400">
              
              <img 
                src={product.imageUrl} 
                alt={product.title} 
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />

              <div className="absolute bottom-3 left-1/2 flex w-max -translate-x-1/2 translate-y-4 items-center gap-1 rounded-full bg-blue-900 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-yellow-400 opacity-0 shadow-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <span>View Item</span>
                <span className="text-sm leading-none">&rarr;</span>
              </div>
            </div>

            <p className="mt-5 text-[11px] font-extrabold uppercase tracking-[0.28em] text-yellow-500">
              {product.category}
            </p>
            
            <h3 className="mt-2 text-lg font-bold text-blue-900 transition-colors group-hover:text-blue-700">
              {product.title}
            </h3>
          </div>

          <div className="mt-4 flex items-center justify-between border-t-2 border-slate-100 pt-4">
            <span className="rounded-lg bg-yellow-400 px-3 py-1 text-sm font-black text-blue-900 transition-transform duration-300 group-hover:scale-105">
              {product.price}
            </span>
            
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              {product.stock || 'In Stock'}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductList;