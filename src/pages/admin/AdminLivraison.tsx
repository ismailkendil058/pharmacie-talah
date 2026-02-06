import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useStore } from '@/contexts/StoreContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Save } from 'lucide-react';
import { toast } from 'sonner';

const AdminLivraison = () => {
  const { deliveryPrices, updateDeliveryPrice } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [editedPrices, setEditedPrices] = useState<Record<string, { domicile: string; bureau: string }>>({});

  const filteredPrices = deliveryPrices.filter(dp => 
    dp.wilaya.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePriceChange = (wilaya: string, field: 'domicile' | 'bureau', value: string) => {
    setEditedPrices(prev => ({
      ...prev,
      [wilaya]: {
        ...prev[wilaya],
        [field]: value,
      }
    }));
  };

  const getPrice = (wilaya: string, field: 'domicile' | 'bureau', original: number) => {
    return editedPrices[wilaya]?.[field] ?? original.toString();
  };

  const hasChanges = (wilaya: string, originalDomicile: number, originalBureau: number) => {
    const edited = editedPrices[wilaya];
    if (!edited) return false;
    return edited.domicile !== originalDomicile.toString() || edited.bureau !== originalBureau.toString();
  };

  const handleSave = (wilaya: string, originalDomicile: number, originalBureau: number) => {
    const edited = editedPrices[wilaya];
    const newDomicile = edited?.domicile ? parseFloat(edited.domicile) : originalDomicile;
    const newBureau = edited?.bureau ? parseFloat(edited.bureau) : originalBureau;

    updateDeliveryPrice(wilaya, newDomicile, newBureau);
    
    // Clear edited state for this wilaya
    setEditedPrices(prev => {
      const updated = { ...prev };
      delete updated[wilaya];
      return updated;
    });
    
    toast.success(`Tarifs de ${wilaya} mis à jour`);
  };

  const handleSaveAll = () => {
    Object.entries(editedPrices).forEach(([wilaya, prices]) => {
      const original = deliveryPrices.find(dp => dp.wilaya === wilaya);
      if (original) {
        const newDomicile = prices.domicile ? parseFloat(prices.domicile) : original.domicile;
        const newBureau = prices.bureau ? parseFloat(prices.bureau) : original.bureau;
        updateDeliveryPrice(wilaya, newDomicile, newBureau);
      }
    });
    
    setEditedPrices({});
    toast.success('Tous les tarifs ont été mis à jour');
  };

  const hasAnyChanges = Object.keys(editedPrices).length > 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tarifs de livraison</h1>
            <p className="text-muted-foreground mt-1">
              Configurez les prix de livraison par wilaya
            </p>
          </div>
          {hasAnyChanges && (
            <Button onClick={handleSaveAll} className="gap-2">
              <Save className="h-4 w-4" />
              Enregistrer tout
            </Button>
          )}
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une wilaya..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Delivery Prices Table */}
        <Card>
          <CardHeader>
            <CardTitle>Tarifs par wilaya ({filteredPrices.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Wilaya</TableHead>
                    <TableHead>Domicile (DA)</TableHead>
                    <TableHead>Bureau (DA)</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPrices.map((dp) => (
                    <TableRow key={dp.wilaya}>
                      <TableCell className="font-medium">{dp.wilaya}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={getPrice(dp.wilaya, 'domicile', dp.domicile)}
                          onChange={(e) => handlePriceChange(dp.wilaya, 'domicile', e.target.value)}
                          className="w-28"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={getPrice(dp.wilaya, 'bureau', dp.bureau)}
                          onChange={(e) => handlePriceChange(dp.wilaya, 'bureau', e.target.value)}
                          className="w-28"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        {hasChanges(dp.wilaya, dp.domicile, dp.bureau) && (
                          <Button 
                            size="sm"
                            onClick={() => handleSave(dp.wilaya, dp.domicile, dp.bureau)}
                          >
                            Enregistrer
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminLivraison;
