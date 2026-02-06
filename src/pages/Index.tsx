import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Truck, Shield, Clock, Pill, Droplets, Sparkles, Stethoscope } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import ProductCard from '@/components/ProductCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useStore } from '@/contexts/StoreContext';

const Index = () => {
  const { products } = useStore();

  // Define categories
  const categories = [
    { id: 'complement', name: 'Compléments', icon: <Pill /> },
    { id: 'vitamine', name: 'Vitamines', icon: <Droplets /> },
    { id: 'cosmetique', name: 'Cosmétiques', icon: <Sparkles /> },
    { id: 'paramedical', name: 'Paramédicaux', icon: <Stethoscope /> },
  ];

  // Get featured products (first 4)
  const featuredProducts = products.slice(0, 4);

  // Get products by category
  const cosmetiqueProducts = products.filter(p => p.categorie === 'cosmetique').slice(0, 4);
  const paramedicalProducts = products.filter(p => p.categorie === 'paramedical').slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pharmacy-gradient py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
                Pharmacie Talah
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground font-light">
                Votre pharmacie de confiance
              </p>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Découvrez notre sélection de produits cosmétiques et paramédicaux de qualité. 
                Livraison disponible dans toutes les wilayas d'Algérie.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button asChild size="lg" className="gap-2">
                  <Link to="/produits">
                    Découvrir nos produits
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/ordonnance">
                    Envoyer une ordonnance
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center mx-auto">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Livraison Nationale</h3>
                <p className="text-sm text-muted-foreground">
                  Livraison dans toutes les 58 wilayas d'Algérie
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center mx-auto">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Produits Certifiés</h3>
                <p className="text-sm text-muted-foreground">
                  Qualité garantie et produits authentiques
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center mx-auto">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Paiement à la Livraison</h3>
                <p className="text-sm text-muted-foreground">
                  Payez en espèces à la réception
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-8">Catégories</h2>
            <Carousel
              className="w-full max-w-4xl mx-auto"
              plugins={[
                Autoplay({
                  delay: 1500,
                }),
              ]}
            >
              <CarouselContent>
                {categories.map((category) => (
                  <CarouselItem key={category.id} className="md:basis-1/2 lg:basis-1/4">
                    <div className="p-1">
                      <Button
                        asChild
                        variant="outline"
                        className="w-full h-20 rounded-full border-2 hover:border-primary hover:bg-primary/5 transition-colors"
                      >
                        <Link to={`/produits?categorie=${category.id}`} className="flex flex-col items-center justify-center gap-2">
                          <span className="text-2xl">{category.icon}</span>
                          <span className="text-sm font-medium">{category.name}</span>
                        </Link>
                      </Button>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">Nouveautés</h2>
                <p className="text-muted-foreground mt-1">Nos derniers produits disponibles</p>
              </div>
              <Button asChild variant="ghost" className="gap-2">
                <Link to="/produits">
                  Voir tout
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Cosmétique Section */}
        {cosmetiqueProducts.length > 0 && (
          <section className="py-16 bg-secondary/30">
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">Packs Cosmétiques</h2>
                  <p className="text-muted-foreground mt-1">Soins beauté et bien-être</p>
                </div>
                <Button asChild variant="ghost" className="gap-2">
                  <Link to="/produits?categorie=cosmetique">
                    Voir tout
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {cosmetiqueProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Paramédical Section */}
        {paramedicalProducts.length > 0 && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">Produits Paramédicaux</h2>
                  <p className="text-muted-foreground mt-1">Équipements et accessoires médicaux</p>
                </div>
                <Button asChild variant="ghost" className="gap-2">
                  <Link to="/produits?categorie=paramedical">
                    Voir tout
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {paramedicalProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Vous avez une ordonnance ?
            </h2>
            <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
              Envoyez-nous votre ordonnance et nous vous contacterons pour confirmer votre commande.
            </p>
            <Button asChild variant="secondary" size="lg">
              <Link to="/ordonnance">
                Envoyer mon ordonnance
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
