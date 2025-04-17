
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux";
import { fetchCategories } from "@/store/productSlice";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ShirtIcon, 
  WatchIcon, 
  Smartphone, 
  GemIcon, 
  MoreHorizontalIcon 
} from "lucide-react";
import { cn } from "@/lib/utils";

// Map for category icons
const categoryIcons: Record<string, React.ReactNode> = {
  "men's clothing": <ShirtIcon className="h-6 w-6" />,
  "women's clothing": <ShirtIcon className="h-6 w-6" />,
  "electronics": <Smartphone className="h-6 w-6" />,
  "jewelery": <GemIcon className="h-6 w-6" />,
};

export function CategorySection() {
  const dispatch = useAppDispatch();
  const { categories, status } = useAppSelector((state) => state.products);
  
  // Fetch categories when component mounts
  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  // Generate a gradient color based on index
  const getGradient = (index: number) => {
    const gradients = [
      "bg-gradient-to-br from-blue-500 to-purple-600",
      "bg-gradient-to-br from-pink-500 to-orange-400",
      "bg-gradient-to-br from-green-400 to-cyan-500",
      "bg-gradient-to-br from-purple-500 to-indigo-500",
      "bg-gradient-to-br from-yellow-400 to-orange-500",
      "bg-gradient-to-br from-teal-400 to-emerald-500",
    ];
    
    return gradients[index % gradients.length];
  };

  // Loading skeletons
  const renderSkeletons = () => {
    return Array(4)
      .fill(0)
      .map((_, i) => (
        <div key={i} className="flex flex-col items-center">
          <Skeleton className="h-16 w-16 rounded-full" />
          <Skeleton className="h-4 w-24 mt-3" />
        </div>
      ));
  };

  return (
    <section className="py-16">
      <div className="container px-4 mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
          Shop by Category
        </h2>
        <p className="text-muted-foreground text-center mb-10">
          Browse our curated collections
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {status === 'loading' ? (
            renderSkeletons()
          ) : (
            categories.map((category, index) => (
              <Link
                key={category}
                to={`/products?category=${category}`}
                className="group flex flex-col items-center text-center"
              >
                <div className={cn(
                  "h-16 w-16 rounded-full flex items-center justify-center text-white transition-transform group-hover:scale-110",
                  getGradient(index)
                )}>
                  {categoryIcons[category] || <MoreHorizontalIcon className="h-6 w-6" />}
                </div>
                <h3 className="mt-3 capitalize text-sm font-medium group-hover:text-primary transition-colors">
                  {category}
                </h3>
              </Link>
            ))
          )}
        </div>
        
        <div className="text-center mt-12">
          <Link
            to="/products"
            className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
          >
            View All Categories
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ml-1"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
