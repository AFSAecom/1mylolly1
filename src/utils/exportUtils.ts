export interface DateFilter {
  start?: string;
  end?: string;
}

export function exportCSV(
  type: "sales" | "clients",
  orders: any[],
  users: any[],
  dateFilter: DateFilter = {}
) {
  let csvContent = "\uFEFF"; // UTF-8 BOM
  let headers = "";
  let rows = "";
  const currentDate = new Date().toISOString().split("T")[0];

  if (type === "sales") {
    headers =
      "Date,Client,Code Client,Produit,Code Article,Marque Inspirée,Montant TND,Conseillère\n";
    const filteredSales = orders.filter((sale) => {
      if (!dateFilter.start || !dateFilter.end) return true;
      const saleDate = new Date(sale.date);
      const startDate = new Date(dateFilter.start);
      const endDate = new Date(dateFilter.end);
      return saleDate >= startDate && saleDate <= endDate;
    });
    filteredSales.forEach((sale) => {
      rows += `"${sale.date}","${sale.client}","${sale.codeClient}","${sale.product}","${sale.codeArticle}","Yves Saint Laurent","${sale.amount.toFixed(
        3
      )}","${sale.conseillere}"\n`;
    });
  } else if (type === "clients") {
    headers =
      "Client,Code Client,Email,Articles Achetés,Parfum Inspiré,Marque Inspirée,Prix TND,Date Achat,Statut\n";
    users
      .filter((user) => user.role === "client")
      .forEach((client) => {
        rows += `"${client.name}","${client.codeClient}","${client.email}","L001-30","Black Opium","Yves Saint Laurent","29.900","${client.lastOrder}","Actif"\n`;
      });
  }

  csvContent += headers + rows;

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${type}_export_${currentDate}.csv`);
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
