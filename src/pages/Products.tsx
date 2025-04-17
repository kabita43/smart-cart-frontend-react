
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux";
import { fetchProducts, fetchCategories, setFilter, clearFilters } from "@/store/productSlice";
import { ProductCard } from "@/components/product/ProductCard";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { 
  Slider,
  Input,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton
} from "@/components/ui";
import { SearchIcon, FilterIcon, XIcon } from "lucide-react";
import { useSearchParams } from "react-router-dom";

export default function Products() {
  const dispatch = useAppDispatch();
  const { items, filteredItems, categories, status, filters } = useAppSelector((state) => state.products);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch products and categories when component mounts
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, status, categories.length]);

  // Handle URL search params
  useEffect(() => {
    const category = searchParams.get("category");
    if (category) {
      dispatch(setFilter({ key: "category", value: category }));
    }
  }, [searchParams, dispatch]);

  // Handle search
  const handleSearch = () => {
    dispatch(setFilter({ key: "search", value: searchQuery }));
    
    // Update URL params
    if (searchQuery) {
      searchParams.set("search", searchQuery);
    } else {
      searchParams.delete("search");
    }
    setSearchParams(searchParams);
  };

  // Handle category change
  const handleCategoryChange = (value: string) => {
    dispatch(setFilter({ key: "category", value }));
    
    // Update URL params
    if (value !== "all") {
      searchParams.set("category", value);
    } else {
      searchParams.delete("category");
    }
    setSearchParams(searchParams);
  };

  // Handle price range change
  const handlePriceChange = (value: [number, number]) => {
    dispatch(setFilter({ key: "minPrice", value: value[0] }));
    dispatch(setFilter({ key: "maxPrice", value: value[1] }));
  };

  // Reset filters
  const handleResetFilters = () => {
    dispatch(clearFilters());
    setSearchQuery("");
    setSearchParams({});
  };

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

  // Calculate price range for the slider
  const maxProductPrice = Math.ceil(Math.max(...items.map(item => item.price)));

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <div className="bg-muted/30 py-10">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold">All Products</h1>
            <p className="text-muted-foreground mt-2">
              Browse our collection of quality products
            </p>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          {/* Search and Filters Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              {/* Search Input */}
              <div className="flex-1 flex gap-2">
                <div className="relative flex-grow">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4"
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <Button onClick={handleSearch}>Search</Button>
              </div>
              
              {/* Filter Toggle - Mobile */}
              <Button 
                variant="outline" 
                className="md:hidden flex items-center justify-center gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FilterIcon className="h-4 w-4" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
            </div>
            
            {/* Filters Row */}
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${showFilters ? 'block' : 'hidden md:grid'}`}>
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <Select 
                  value={filters.category} 
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Price Range Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Price Range: ${filters.minPrice} - ${filters.maxPrice}
                </label>
                <Slider
                  defaultValue={[filters.minPrice, filters.maxPrice]}
                  min={0}
                  max={maxProductPrice || 1000}
                  step={1}
                  onValueChange={handlePriceChange as (value: number[]) => void}
                  className="my-4"
                />
              </div>
              
              {/* Reset Filters */}
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  className="gap-2" 
                  onClick={handleResetFilters}
                >
                  <XIcon className="h-4 w-4" />
                  Reset Filters
                </Button>
              </div>
            </div>
          </div>
          
          {/* Results Count */}
          <div className="mb-6 flex justify-between items-center">
            <p className="text-muted-foreground">
              Showing {filteredItems.length} {filteredItems.length === 1 ? 'product' : 'products'}
            </p>
          </div>
          
          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {status === 'loading' ? (
              renderSkeletons()
            ) : filteredItems.length > 0 ? (
              filteredItems.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full py-12 text-center">
                <h3 className="text-lg font-medium mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search term.
                </p>
                <Button onClick={handleResetFilters}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
      <CartDrawer />
    </div>
  );
}
