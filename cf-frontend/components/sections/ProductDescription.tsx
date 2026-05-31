import type { BackendProductDetail } from "@/types/product";
import { getProductCoverImage } from "@/lib/product-utils";

interface ProductDescriptionProps {
  product: BackendProductDetail;
}

export default function ProductDescription({
  product,
}: ProductDescriptionProps) {
  const coverImage = getProductCoverImage(product);
  const longDescription =
    product.longDescription || product.description || "";
  const specifications = product.specifications || [];

  return (
    <section className="w-full">
      <div className="flex">
        {/* Left — Teal geometric sidebar */}
        <div className="hidden lg:block w-1/4 bg-[#3D6B6B] relative overflow-hidden">
          {/* Geometric chevron pattern */}
          <div className="absolute inset-0 opacity-20">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-full"
                style={{
                  top: `${i * 12.5}%`,
                  height: "12.5%",
                  background: `linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.15) 40%, rgba(255,255,255,0.15) 50%, transparent 50%), linear-gradient(225deg, transparent 40%, rgba(255,255,255,0.15) 40%, rgba(255,255,255,0.15) 50%, transparent 50%)`,
                }}
              />
            ))}
          </div>

          {/* Product image overlay */}
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <img
              src={coverImage}
              alt={product.name}
              className="max-h-[60%] max-w-full object-contain opacity-80 drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Right — Content */}
        <div className="flex-1 bg-white px-8 lg:px-16 py-12">
          {/* Description heading */}
          <h2 className="text-center text-[#E8B800] text-xl font-bold uppercase tracking-wider mb-1">
            Description
          </h2>
          <div className="w-16 h-0.5 bg-[#E8B800] mx-auto mb-8" />

          {/* Long description */}
          {longDescription && (
            <p className="text-gray-600 text-sm leading-relaxed mb-8">
              {longDescription}
            </p>
          )}

          {/* Product Details */}
          {product.productDetails.length > 0 && (
            <>
              <h3 className="text-gray-800 font-bold text-base mb-3">
                Product Details
              </h3>
              <ul className="list-disc list-inside space-y-1.5 text-gray-600 text-sm mb-8">
                {product.productDetails.map((detail, i) => (
                  <li key={i}>{detail}</li>
                ))}
              </ul>
            </>
          )}

          {/* Dimensions */}
          {product.dimensions.length > 0 && (
            <>
              <h3 className="text-gray-800 font-bold text-base mb-3">
                Advanced Dimensions & Info
              </h3>
              <ul className="list-disc list-inside space-y-1.5 text-gray-600 text-sm mb-8">
                {product.dimensions.map((dim, i) => (
                  <li key={i}>{dim}</li>
                ))}
              </ul>
            </>
          )}

          {/* Care & Cleaning */}
          {product.careAndCleaning && (
            <>
              <h3 className="text-gray-800 font-bold text-base mb-3">
                Care & Cleaning
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-8">
                {product.careAndCleaning}
              </p>
            </>
          )}

          {/* Specifications */}
          {specifications.length > 0 && (
            <>
              <h3 className="text-gray-800 font-bold text-base mb-3">
                Specification Information
              </h3>
              <table className="w-full text-sm">
                <tbody>
                  {specifications.map((spec, i) => (
                    <tr
                      key={i}
                      className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <td className="py-2 px-3 font-semibold text-gray-700 w-1/3">
                        {spec.label}
                      </td>
                      <td className="py-2 px-3 text-gray-600">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
