import Button from './Button';

const ProductCard = ({ product, index }) => {
  return (
    <article className="flex flex-col h-full rounded-3xl border-2 border-blue-900 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-yellow-400 hover:shadow-xl font-['Outfit']">
      
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.25rem] border-2 border-blue-100 bg-slate-50">
        <img 
          src={product.imageUrl} 
          alt={product.title} 
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
        />
        {!product.imageUrl && (
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold uppercase tracking-widest text-blue-300">
                Item {String(index + 1).padStart(2, '0')}
            </div>
        )}
      </div>

      <div className="flex flex-col flex-grow mt-4">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-yellow-500">
          {product.category}
        </p>
        
        <h3 className="mt-1 text-lg font-bold text-blue-900 line-clamp-1">
            {product.title}
        </h3>
        
        <p className="mt-1 text-base font-black text-blue-900">{product.price}</p>
        
        <p className="mt-3 text-sm leading-relaxed text-slate-600 line-clamp-2">
          {product.content[0]}
        </p>
        
        <div className="mt-auto pt-4">
            <Button 
                to={`/products/${product.name}`} 
                className="w-full justify-center border-2 border-blue-900 bg-blue-900 text-yellow-400 hover:bg-yellow-400 hover:text-blue-900 hover:border-yellow-400 transition-colors"
            >
                View Product
            </Button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;