
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux";
import { fetchProducts } from "@/store/productSlice";
import { ProductCard } from "@/components/product/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

export function FeaturedProducts() {
  const dispatch = useAppDispatch();
  const { items, status } = useAppSelector((state) => state.products);
  
  // Fetch products when component mounts
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);
  
  // Get featured products (limit to 8)
  const featuredProducts = items
    .filter(product => product.rating.rate >= 4.0)
    .slice(0, 8);
  
  // Loading skeletons
  const renderSkeletons = () => {
    return Array(8)
      .fill(0)
      .map((_, i) => (
        <div key={i} className="border rounded-xl p-4 space-y-3">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
      ));
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
            <p className="text-muted-foreground mt-2">
              Our collection of highly-rated items chosen for you
            </p>
          </div>
          
          {/* View All link */}
          <a 
            href="/products" 
            className="text-primary hover:underline mt-4 md:mt-0"
          >
            View All Products →
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {status === 'loading' ? (
            renderSkeletons()
          ) : status === 'failed' ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">
                Failed to load products. Please try again later.
              </p>
            </div>
          ) : (
            featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
