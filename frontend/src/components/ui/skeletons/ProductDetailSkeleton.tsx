import { Skeleton, SkeletonText } from "../Skeleton";

const ProductDetailSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb skeleton */}
      <Skeleton className="h-5 w-48 mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product image skeleton */}
        <div>
          <Skeleton className="w-full aspect-square rounded-lg" />
        </div>

        {/* Product details skeleton */}
        <div className="space-y-6">
          {/* Title */}
          <Skeleton className="h-10 w-3/4" />

          {/* Price */}
          <Skeleton className="h-8 w-32" />

          {/* Description */}
          <div className="space-y-3">
            <SkeletonText lines={4} />
          </div>

          {/* Options */}
          <div className="space-y-4">
            <div>
              <Skeleton className="h-5 w-24 mb-2" />
              <div className="flex gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-20" />
                ))}
              </div>
            </div>
            <div>
              <Skeleton className="h-5 w-24 mb-2" />
              <div className="flex gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-20" />
                ))}
              </div>
            </div>
          </div>

          {/* Quantity selector */}
          <div>
            <Skeleton className="h-5 w-24 mb-2" />
            <Skeleton className="h-12 w-32" />
          </div>

          {/* Add to basket button */}
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;
