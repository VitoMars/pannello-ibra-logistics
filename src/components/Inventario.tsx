import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InventoryItem } from "../types/types";
import { useState } from "react";
import { Checkbox } from "primereact/checkbox";

interface InventarioProps {
  inventory: InventoryItem[];
  isLoading: boolean;
}

const Inventario = ({ inventory, isLoading }: InventarioProps) => {
  const [filterPositiveStock, setFilterPositiveStock] = useState<boolean>(false);
  const [filterCancelledItems, setFilterCancelledItems] = useState<boolean>(false);

  const filteredInventory = inventory.filter(item => {
    const isPositiveStock = filterPositiveStock ? item.qtagiacenzaattuale > 0 : true;
    const isNotCancelled = filterCancelledItems ? true : !item.isannullato;
    return isPositiveStock && isNotCancelled;
  });

  return (
    <div>
      <div className="flex flex-col items-start gap-3 mb-5">
        <div>
          <Checkbox
            checked={filterPositiveStock}
            onChange={(e) => setFilterPositiveStock(Boolean(e.checked))}
            name="Visualizza articoli con giacenza maggiore di 0"
          />
          <label className="ml-2">Visualizza articoli con giacenza maggiore di 0</label>
        </div>
        <div>
          <Checkbox
            checked={filterCancelledItems}
            onChange={(e) => setFilterCancelledItems(Boolean(e.checked))}
            name="Visualizza anche articoli annullati"
          />
          <label className="ml-2">Visualizza anche articoli annullati</label>
        </div>
      </div>

      <DataTable
        value={filteredInventory}
        loading={isLoading}
        size="small"
        rows={10}
        totalRecords={inventory.length}
        showGridlines
        paginator
        removableSort
        emptyMessage="Nessun dato disponibile"
      >
        <Column field="codice" header="Codice" sortable />
        <Column field="descrizionebreve" header="Articolo" sortable />
        <Column field="unitaDiMisura" header="U.d.M." sortable style={{ textAlign: "center" }} />
        <Column field="qtagiacenzaattuale" header="Qtà in giacenza" sortable style={{ textAlign: "right" }} />
      </DataTable>
    </div>
  );
};

export default Inventario;
