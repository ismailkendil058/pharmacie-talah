import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, Settings } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <div className="h-10 w-10 rounded-full bg-primary-foreground flex items-center justify-center">
                <span className="text-primary font-bold text-lg">PT</span>
              </div>
              <h3 className="text-xl font-semibold">Pharmacie Talah</h3>
            </div>
            <p className="text-primary-foreground/80 text-sm">
              Votre pharmacie de confiance en Algérie. Qualité, service et bien-être.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4 text-center">
            <h4 className="font-semibold">Navigation</h4>
            <div className="flex flex-col gap-2 text-sm text-primary-foreground/80">
              <Link to="/" className="hover:text-primary-foreground transition-colors">Accueil</Link>
              <Link to="/produits" className="hover:text-primary-foreground transition-colors">Nos Produits</Link>
              <Link to="/ordonnance" className="hover:text-primary-foreground transition-colors">Envoyer une Ordonnance</Link>
              <Link to="/localisation" className="hover:text-primary-foreground transition-colors">Nous Trouver</Link>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4 text-center">
            <h4 className="font-semibold">Services</h4>
            <div className="flex flex-col gap-2 text-sm text-primary-foreground/80">
              <span>Livraison à domicile</span>
              <span>Livraison en bureau</span>
              <span>Conseil pharmaceutique</span>
              <span>Commande sur ordonnance</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-primary-foreground/20">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex flex-col gap-2 text-sm text-primary-foreground/80">
              <div className="flex items-center justify-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+213 797 939 772</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Algérie</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Lun - Sam: 8h - 20h</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-sm text-primary-foreground/60">
                © 2024 Pharmacie Talah. Tous droits réservés.
              </p>
              <Link
                to="/admin"
                className="text-primary-foreground/40 hover:text-primary-foreground/60 transition-colors"
              >
                <Settings className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
