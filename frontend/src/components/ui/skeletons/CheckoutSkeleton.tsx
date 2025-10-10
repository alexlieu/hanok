import { Skeleton } from "../Skeleton";

const CheckoutSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <Skeleton className="h-10 w-64 mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information Section */}
          <div className="border border-gray-200 rounded-lg p-6">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Skeleton className="h-5 w-24 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div>
                  <Skeleton className="h-5 w-24 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              <div>
                <Skeleton className="h-5 w-24 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div>
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>

          {/* Billing Address Section */}
          <div className="border border-gray-200 rounded-lg p-6">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="space-y-4">
              <div>
                <Skeleton className="h-5 w-24 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Skeleton className="h-5 w-16 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div>
                  <Skeleton className="h-5 w-24 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="border border-gray-200 rounded-lg p-6">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="space-y-4">
              <div>
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Skeleton className="h-5 w-24 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div>
                  <Skeleton className="h-5 w-16 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="border border-gray-200 rounded-lg p-6 space-y-4 sticky top-4">
            <Skeleton className="h-6 w-32 mb-4" />

            {/* Order items */}
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="flex gap-3 pb-3 border-b border-gray-100"
                >
                  <Skeleton className="w-16 h-16 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-5 w-12" />
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="border-t pt-4">
              <div className="flex justify-between mb-4">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>

            {/* Submit button */}
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSkeleton;
