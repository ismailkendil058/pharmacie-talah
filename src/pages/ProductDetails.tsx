import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useStore } from '@/contexts/StoreContext';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, ShoppingBag, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { products, addToCart } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Produit non trouvé</h1>
            <Button onClick={() => navigate('/produits')}>
              Retour aux produits
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    toast.success('Produit ajouté au panier', {
      description: product.nom,
    });
  };

  const handleBuyNow = () => {
    addToCart(product);
    navigate('/panier');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'decimal',
      minimumFractionDigits: 0,
    }).format(price) + ' DA';
  };

  const getCategoryLabel = (categorie: Product['categorie']) => {
    const labels = {
      cosmetique: 'Cosmétique',
      paramedical: 'Paramédical',
      complement: 'Complément',
      vitamine: 'Vitamine',
    };
    return labels[categorie];
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Back Button */}
        <section className="py-4 border-b border-border">
          <div className="container mx-auto px-4">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
          </div>
        </section>

        {/* Product Details */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Product Image */}
              <div className="aspect-square overflow-hidden rounded-lg bg-secondary/30">
                <img
                  src={product.image}
                  alt={product.nom}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    {getCategoryLabel(product.categorie)}
                  </span>
                  <h1 className="text-3xl font-bold text-foreground">
                    {product.nom}
                  </h1>
                  <p className="text-muted-foreground">
                    {product.description}
                  </p>
                </div>

                <div className="space-y-4">
                  <p className="text-3xl font-bold text-primary">
                    {formatPrice(product.prix)}
                  </p>

                  <div className="flex gap-4">
                    <Button
                      onClick={handleBuyNow}
                      className="flex-1 gap-2"
                      size="lg"
                    >
                      <ShoppingBag className="h-5 w-5" />
                      Acheter maintenant
                    </Button>
                    <Button
                      onClick={handleAddToCart}
                      variant="outline"
                      size="lg"
                      className="px-6"
                    >
                      <ShoppingCart className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="pt-6 border-t border-border">
                  <h3 className="font-semibold text-foreground mb-2">Informations supplémentaires</h3>
                  <p className="text-sm text-muted-foreground">
                    Produit de qualité garantie. Livraison disponible dans toutes les wilayas d'Algérie.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetails;
