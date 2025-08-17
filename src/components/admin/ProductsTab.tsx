import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { fetchProducts } from "../../services/admin";

interface Product {
  id: string;
  code_produit: string;
  nom_lolly: string;
}

const PAGE_SIZE = 50;

const ProductsTab: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadPage = async (pageIndex: number) => {
    setLoading(true);
    const from = pageIndex * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    const { data } = await fetchProducts(from, to);
    setProducts((prev) => [...prev, ...(data || [])]);
    setLoading(false);
  };

  useEffect(() => {
    loadPage(0);
  }, []);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    loadPage(next);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des Produits</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Nom</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.code_produit}</TableCell>
                <TableCell>{p.nom_lolly}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {loading && <div className="mt-4">Chargement...</div>}
        <div className="mt-4 flex justify-center">
          <Button onClick={loadMore} disabled={loading} variant="outline">
            Charger plus
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductsTab;
