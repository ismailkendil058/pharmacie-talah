import { Product } from '@/types';
import { useStore } from '@/contexts/StoreContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useStore();
  const navigate = useNavigate();

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
    <Card className="group overflow-hidden pharmacy-card-shadow pharmacy-hover-lift border-border/50 cursor-pointer" onClick={() => navigate(`/produit/${product.id}`)}>
      <div className="aspect-square overflow-hidden bg-secondary/30">
        <img
          src={product.image}
          alt={product.nom}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <CardContent className="p-5 space-y-3">
        <div className="space-y-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {getCategoryLabel(product.categorie)}
          </span>
          <h3 className="font-semibold text-foreground line-clamp-2 leading-snug">
            {product.nom}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="pt-2 space-y-3">
          <p className="text-xl font-bold text-primary">
            {formatPrice(product.prix)}
          </p>

          <div className="flex gap-2">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleBuyNow();
              }}
              className="flex-1 gap-2"
              size="sm"
            >
              <ShoppingBag className="h-4 w-4" />
              Acheter
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }}
              variant="outline"
              size="sm"
              className="px-3"
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
