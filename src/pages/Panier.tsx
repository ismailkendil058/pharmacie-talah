import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useStore } from '@/contexts/StoreContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, CheckCircle, Home, Building } from 'lucide-react';
import { wilayas } from '@/data/wilayas';
import { toast } from 'sonner';

const Panier = () => {
  const { cart, updateCartQuantity, removeFromCart, cartTotal, addOrder, getDeliveryPrice } = useStore();
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [formData, setFormData] = useState({
    nomComplet: '',
    telephone: '',
    wilaya: '',
    baladiya: '',
    methodeLivraison: 'domicile' as 'domicile' | 'bureau',
  });

  const selectedWilaya = useMemo(() => 
    wilayas.find(w => w.nom === formData.wilaya),
    [formData.wilaya]
  );

  const deliveryPrice = useMemo(() => {
    if (!formData.wilaya) return 0;
    return getDeliveryPrice(formData.wilaya, formData.methodeLivraison);
  }, [formData.wilaya, formData.methodeLivraison, getDeliveryPrice]);

  const total = cartTotal + deliveryPrice;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-DZ').format(price) + ' DA';
  };

  const handleWilayaChange = (wilaya: string) => {
    setFormData({
      ...formData,
      wilaya,
      baladiya: '', // Reset baladiya when wilaya changes
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nomComplet || !formData.telephone || !formData.wilaya || !formData.baladiya) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    addOrder({
      nomComplet: formData.nomComplet,
      telephone: formData.telephone,
      wilaya: formData.wilaya,
      baladiya: formData.baladiya,
      methodeLivraison: formData.methodeLivraison,
      items: cart,
      sousTotal: cartTotal,
      fraisLivraison: deliveryPrice,
      total,
    });

    setStep('success');
    toast.success('Commande passée avec succès');
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16">
          <Card className="max-w-md mx-4 text-center">
            <CardContent className="pt-8 pb-8">
              <div className="h-16 w-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Commande Confirmée
              </h2>
              <p className="text-muted-foreground mb-6">
                Merci pour votre commande ! Nous vous contacterons bientôt pour confirmer la livraison.
              </p>
              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link to="/produits">Continuer vos achats</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/">Retour à l'accueil</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Votre panier est vide
            </h2>
            <p className="text-muted-foreground mb-6">
              Découvrez nos produits et ajoutez-les à votre panier
            </p>
            <Button asChild>
              <Link to="/produits">Voir nos produits</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          {step === 'cart' ? (
            <>
              <div className="flex items-center gap-4 mb-8">
                <Button variant="ghost" size="icon" asChild>
                  <Link to="/produits">
                    <ArrowLeft className="h-5 w-5" />
                  </Link>
                </Button>
                <h1 className="text-3xl font-bold text-foreground">Votre Panier</h1>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                  {cart.map((item) => (
                    <Card key={item.product.id}>
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="h-24 w-24 rounded-lg overflow-hidden bg-secondary/30 shrink-0">
                            <img 
                              src={item.product.image} 
                              alt={item.product.nom}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground truncate">
                              {item.product.nom}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {formatPrice(item.product.prix)}
                            </p>
                            <div className="flex items-center gap-3 mt-3">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-8 text-center font-medium">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive ml-auto"
                                onClick={() => removeFromCart(item.product.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-foreground">
                              {formatPrice(item.product.prix * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Summary */}
                <div>
                  <Card className="sticky top-24">
                    <CardHeader>
                      <CardTitle>Résumé</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sous-total</span>
                        <span className="font-medium">{formatPrice(cartTotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Livraison</span>
                        <span className="text-sm text-muted-foreground">Calculé à l'étape suivante</span>
                      </div>
                      <div className="border-t pt-4">
                        <div className="flex justify-between text-lg font-semibold">
                          <span>Total</span>
                          <span>{formatPrice(cartTotal)}</span>
                        </div>
                      </div>
                      <Button className="w-full" size="lg" onClick={() => setStep('checkout')}>
                        Passer la commande
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-4 mb-8">
                <Button variant="ghost" size="icon" onClick={() => setStep('cart')}>
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-3xl font-bold text-foreground">Finaliser la commande</h1>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Checkout Form */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Informations de livraison</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="nomComplet">Nom complet *</Label>
                            <Input
                              id="nomComplet"
                              placeholder="Votre nom complet"
                              value={formData.nomComplet}
                              onChange={(e) => setFormData({ ...formData, nomComplet: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="telephone">Téléphone *</Label>
                            <Input
                              id="telephone"
                              type="tel"
                              placeholder="0X XX XX XX XX"
                              value={formData.telephone}
                              onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                              required
                            />
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Wilaya *</Label>
                            <Select value={formData.wilaya} onValueChange={handleWilayaChange}>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner une wilaya" />
                              </SelectTrigger>
                              <SelectContent>
                                {wilayas.map((wilaya) => (
                                  <SelectItem key={wilaya.code} value={wilaya.nom}>
                                    {wilaya.code} - {wilaya.nom}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Baladiya *</Label>
                            <Select 
                              value={formData.baladiya} 
                              onValueChange={(value) => setFormData({ ...formData, baladiya: value })}
                              disabled={!selectedWilaya}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner une baladiya" />
                              </SelectTrigger>
                              <SelectContent>
                                {selectedWilaya?.baladiyas.map((baladiya) => (
                                  <SelectItem key={baladiya} value={baladiya}>
                                    {baladiya}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label>Méthode de livraison *</Label>
                          <RadioGroup
                            value={formData.methodeLivraison}
                            onValueChange={(value: 'domicile' | 'bureau') => 
                              setFormData({ ...formData, methodeLivraison: value })
                            }
                            className="grid sm:grid-cols-2 gap-4"
                          >
                            <Label
                              htmlFor="domicile"
                              className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                                formData.methodeLivraison === 'domicile' 
                                  ? 'border-primary bg-accent' 
                                  : 'border-border hover:border-primary/50'
                              }`}
                            >
                              <RadioGroupItem value="domicile" id="domicile" />
                              <Home className="h-5 w-5 text-muted-foreground" />
                              <div className="flex-1">
                                <p className="font-medium">Livraison à domicile</p>
                                <p className="text-sm text-muted-foreground">
                                  {formData.wilaya 
                                    ? formatPrice(getDeliveryPrice(formData.wilaya, 'domicile'))
                                    : 'Sélectionnez une wilaya'}
                                </p>
                              </div>
                            </Label>
                            <Label
                              htmlFor="bureau"
                              className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                                formData.methodeLivraison === 'bureau' 
                                  ? 'border-primary bg-accent' 
                                  : 'border-border hover:border-primary/50'
                              }`}
                            >
                              <RadioGroupItem value="bureau" id="bureau" />
                              <Building className="h-5 w-5 text-muted-foreground" />
                              <div className="flex-1">
                                <p className="font-medium">Livraison en bureau</p>
                                <p className="text-sm text-muted-foreground">
                                  {formData.wilaya 
                                    ? formatPrice(getDeliveryPrice(formData.wilaya, 'bureau'))
                                    : 'Sélectionnez une wilaya'}
                                </p>
                              </div>
                            </Label>
                          </RadioGroup>
                        </div>

                        <Button type="submit" className="w-full" size="lg">
                          Confirmer la commande
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>

                {/* Order Summary */}
                <div>
                  <Card className="sticky top-24">
                    <CardHeader>
                      <CardTitle>Votre commande</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {cart.map((item) => (
                        <div key={item.product.id} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {item.product.nom} × {item.quantity}
                          </span>
                          <span>{formatPrice(item.product.prix * item.quantity)}</span>
                        </div>
                      ))}
                      <div className="border-t pt-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Sous-total</span>
                          <span>{formatPrice(cartTotal)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Livraison</span>
                          <span>{formData.wilaya ? formatPrice(deliveryPrice) : '-'}</span>
                        </div>
                        <div className="border-t pt-2">
                          <div className="flex justify-between text-lg font-semibold">
                            <span>Total</span>
                            <span>{formatPrice(total)}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground text-center">
                        Paiement à la livraison uniquement
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Panier;
