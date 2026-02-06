import AdminLayout from '@/components/admin/AdminLayout';
import { useStore } from '@/contexts/StoreContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingCart, FileText, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const { products, orders, ordonnances } = useStore();

  const stats = [
    {
      title: 'Produits',
      value: products.length,
      icon: Package,
      description: 'Total des produits',
    },
    {
      title: 'Commandes',
      value: orders.length,
      icon: ShoppingCart,
      description: 'Total des commandes',
    },
    {
      title: 'En attente',
      value: orders.filter(o => o.status === 'en_attente').length,
      icon: TrendingUp,
      description: 'Commandes à traiter',
    },
    {
      title: 'Ordonnances',
      value: ordonnances.length,
      icon: FileText,
      description: 'Total des ordonnances',
    },
  ];

  const recentOrders = orders.slice(-5).reverse();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-DZ').format(price) + ' DA';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      en_attente: 'bg-yellow-100 text-yellow-800',
      confirmee: 'bg-blue-100 text-blue-800',
      livree: 'bg-green-100 text-green-800',
      annulee: 'bg-red-100 text-red-800',
    };
    const labels = {
      en_attente: 'En attente',
      confirmee: 'Confirmée',
      livree: 'Livrée',
      annulee: 'Annulée',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tableau de bord</h1>
          <p className="text-muted-foreground mt-1">
            Bienvenue dans l'administration de Pharmacie Talah
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Dernières commandes</CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div 
                    key={order.id} 
                    className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg"
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">{order.nomComplet}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.wilaya}, {order.baladiya}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right space-y-2">
                      {getStatusBadge(order.status)}
                      <p className="font-semibold text-foreground">
                        {formatPrice(order.total)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Aucune commande pour le moment
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
