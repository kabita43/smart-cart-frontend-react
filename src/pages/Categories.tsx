
import { useState } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Link } from "react-router-dom";

// Sample category data
const categories = [
  { id: 1, name: "Electronics", count: 24 },
  { id: 2, name: "Clothing", count: 18 },
  { id: 3, name: "Home & Kitchen", count: 12 },
  { id: 4, name: "Beauty & Personal Care", count: 9 },
  { id: 5, name: "Sports & Outdoors", count: 7 },
];

// Sample products data
const products = [
  { id: 1, title: "Wireless Headphones", price: 89.99, image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg", category: "Electronics" },
  { id: 2, title: "Casual T-Shirt", price: 19.99, image: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg", category: "Clothing" },
  { id: 3, title: "Coffee Maker", price: 49.99, image: "https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg", category: "Home & Kitchen" },
  { id: 4, title: "Face Moisturizer", price: 24.99, image: "https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg", category: "Beauty & Personal Care" },
  { id: 5, title: "Yoga Mat", price: 29.99, image: "https://fakestoreapi.com/img/71kWymZ+c+L._AC_SX679_.jpg", category: "Sports & Outdoors" },
  { id: 6, title: "Smart Watch", price: 129.99, image: "https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg", category: "Electronics" },
  { id: 7, title: "Winter Jacket", price: 59.99, image: "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg", category: "Clothing" },
  { id: 8, title: "Cookware Set", price: 79.99, image: "https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2.jpg", category: "Home & Kitchen" },
];

export default function Categories() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState([0, 150]);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter products based on selection
  const filteredProducts = products.filter(product => {
    // Filter by category
    const categoryMatch = selectedCategory ? product.category === selectedCategory : true;
    
    // Filter by price range
    const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
    
    // Filter by search query
    const searchMatch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    return categoryMatch && priceMatch && searchMatch;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Shop by Category</h1>
          <p className="text-muted-foreground mt-2">Browse our wide selection of products by category</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3">Search</h3>
              <Input 
                type="text" 
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-3">Categories</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Checkbox 
                    id="all-categories"
                    checked={selectedCategory === null}
                    onCheckedChange={() => setSelectedCategory(null)}
                  />
                  <label htmlFor="all-categories" className="ml-2 text-sm cursor-pointer">
                    All Categories
                  </label>
                </div>

                {categories.map(category => (
                  <div key={category.id} className="flex items-center">
                    <Checkbox 
                      id={`category-${category.id}`}
                      checked={selectedCategory === category.name}
                      onCheckedChange={() => 
                        setSelectedCategory(selectedCategory === category.name ? null : category.name)
                      }
                    />
                    <label 
                      htmlFor={`category-${category.id}`} 
                      className="ml-2 text-sm cursor-pointer flex justify-between w-full"
                    >
                      <span>{category.name}</span>
                      <span className="text-muted-foreground">({category.count})</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-3">Price Range</h3>
              <Slider
                defaultValue={[0, 150]}
                max={200}
                step={1}
                value={priceRange}
                onValueChange={setPriceRange}
                className="my-6"
              />
              <div className="flex items-center justify-between">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>

            <Separator />

            <Button variant="outline" className="w-full" onClick={() => {
              setSelectedCategory(null);
              setPriceRange([0, 150]);
              setSearchQuery("");
            }}>
              Reset Filters
            </Button>
          </div>

          {/* Products Grid */}
          <div className="md:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <Link to={`/product/${product.id}`} key={product.id} className="group">
                    <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <div className="aspect-square bg-muted/50 relative">
                        <img 
                          src={product.image} 
                          alt={product.title}
                          className="w-full h-full object-contain p-4"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
                          {product.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mt-1">{product.category}</p>
                        <p className="mt-2 font-semibold">${product.price.toFixed(2)}</p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <h3 className="text-lg font-medium">No products found</h3>
                  <p className="text-muted-foreground mt-2">
                    Try adjusting your filters or search query
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
