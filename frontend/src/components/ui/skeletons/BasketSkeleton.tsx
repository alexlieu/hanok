import { Skeleton } from "../Skeleton";

const BasketSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <Skeleton className="h-10 w-48 mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Basket items */}
        <div className="lg:col-span-2 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
            >
              {/* Image */}
              <Skeleton className="w-24 h-24 shrink-0" />

              {/* Details */}
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>

              {/* Quantity and price */}
              <div className="shrink-0 space-y-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-6 w-16 ml-auto" />
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="border border-gray-200 rounded-lg p-6 space-y-4 sticky top-4">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-16" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between mb-4">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasketSkeleton;
