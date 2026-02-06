import AdminLayout from '@/components/admin/AdminLayout';
import { useStore } from '@/contexts/StoreContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Trash2, FileText, Image } from 'lucide-react';
import { toast } from 'sonner';

const AdminOrdonnances = () => {
  const { ordonnances, deleteOrdonnance } = useStore();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDownload = (ordonnance: typeof ordonnances[0]) => {
    // Create a download link
    const link = document.createElement('a');
    link.href = ordonnance.fichier;
    link.download = ordonnance.fichierNom;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette ordonnance ?')) {
      deleteOrdonnance(id);
      toast.success('Ordonnance supprimée');
    }
  };

  const isImage = (type: string) => type.startsWith('image/');

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Ordonnances</h1>
          <p className="text-muted-foreground mt-1">
            Consultez les ordonnances envoyées par les clients
          </p>
        </div>

        {/* Ordonnances Table */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des ordonnances ({ordonnances.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {ordonnances.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fichier</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Téléphone</TableHead>
                      <TableHead>Note</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ordonnances.slice().reverse().map((ordonnance) => (
                      <TableRow key={ordonnance.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {isImage(ordonnance.fichierType) ? (
                              <div className="h-12 w-12 rounded overflow-hidden bg-secondary/30">
                                <img 
                                  src={ordonnance.fichier} 
                                  alt="Ordonnance"
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="h-12 w-12 rounded bg-secondary/30 flex items-center justify-center">
                                <FileText className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                            <div className="text-sm">
                              <p className="font-medium truncate max-w-[150px]">
                                {ordonnance.fichierNom}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {isImage(ordonnance.fichierType) ? 'Image' : 'PDF'}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{ordonnance.nom}</TableCell>
                        <TableCell>{ordonnance.telephone}</TableCell>
                        <TableCell>
                          <p className="text-sm text-muted-foreground max-w-[200px] truncate">
                            {ordonnance.note || '-'}
                          </p>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(ordonnance.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleDownload(ordonnance)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDelete(ordonnance.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Aucune ordonnance reçue</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminOrdonnances;
