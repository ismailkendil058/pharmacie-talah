import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useStore } from '@/contexts/StoreContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Upload, FileText, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const Ordonnance = () => {
  const { addOrdonnance } = useStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    telephone: '',
    note: '',
  });
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Check file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
      if (!validTypes.includes(selectedFile.type)) {
        toast.error('Format non supporté', {
          description: 'Veuillez envoyer une image (JPG, PNG) ou un PDF',
        });
        return;
      }
      
      // Check file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error('Fichier trop volumineux', {
          description: 'La taille maximale est de 5 Mo',
        });
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Veuillez sélectionner un fichier');
      return;
    }
    
    if (!formData.nom.trim() || !formData.telephone.trim()) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        
        addOrdonnance({
          nom: formData.nom,
          telephone: formData.telephone,
          note: formData.note,
          fichier: base64,
          fichierNom: file.name,
          fichierType: file.type,
        });
        
        setIsSubmitted(true);
        toast.success('Ordonnance envoyée avec succès');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error('Erreur lors de l\'envoi');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
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
                Ordonnance Envoyée
              </h2>
              <p className="text-muted-foreground mb-6">
                Nous avons bien reçu votre ordonnance. Notre équipe vous contactera bientôt pour confirmer votre commande.
              </p>
              <Button onClick={() => setIsSubmitted(false)}>
                Envoyer une autre ordonnance
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Envoyer une Ordonnance
            </h1>
            <p className="text-muted-foreground mt-2">
              Téléchargez votre ordonnance et nous vous contacterons
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Vos Informations</CardTitle>
              <CardDescription>
                Remplissez le formulaire et joignez votre ordonnance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom complet *</Label>
                  <Input
                    id="nom"
                    placeholder="Votre nom complet"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telephone">Numéro de téléphone *</Label>
                  <Input
                    id="telephone"
                    type="tel"
                    placeholder="0X XX XX XX XX"
                    value={formData.telephone}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note">Note (optionnel)</Label>
                  <Textarea
                    id="note"
                    placeholder="Informations supplémentaires..."
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Ordonnance *</Label>
                  <div 
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      file ? 'border-primary bg-accent/50' : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      id="ordonnance-file"
                    />
                    <label htmlFor="ordonnance-file" className="cursor-pointer">
                      {file ? (
                        <div className="space-y-2">
                          <FileText className="h-10 w-10 mx-auto text-primary" />
                          <p className="font-medium text-foreground">{file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Cliquez pour changer
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
                          <p className="font-medium text-foreground">
                            Cliquez pour télécharger
                          </p>
                          <p className="text-sm text-muted-foreground">
                            JPG, PNG ou PDF (max. 5 Mo)
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Envoi en cours...' : 'Envoyer l\'ordonnance'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Ordonnance;
