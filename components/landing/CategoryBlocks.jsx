'use client'

export default function CategoryBlocks({ blocks = [], onCategoryClick }) {
  if (!blocks.length) return null

  return (
    <section className="py-12 md:py-16 px-6 md:px-12">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {blocks.map((block) => (
          <button
            key={block.id}
            onClick={() => onCategoryClick && onCategoryClick(block.nombre)}
            className="group relative aspect-[3/4] overflow-hidden"
          >
            {block.imagen ? (
              <img
                src={block.imagen}
                alt={block.nombre}
                className="w-full h-full object-cover img-zoom"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display font-light text-gray-400 text-lg uppercase tracking-editorial">
                    {block.nombre}
                  </span>
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-500" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display font-light text-white text-sm md:text-lg uppercase tracking-wide-title"
                style={{ textShadow: '0 1px 10px rgba(0,0,0,0.3)' }}
              >
                {block.nombre}
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
