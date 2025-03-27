import { DataTable } from "primereact/datatable";
import { InventoryItem } from "../types/types";
import { Column } from "primereact/column";
import dayjs from "dayjs";
import { useState } from "react";
import { DatePickerInput } from "@mantine/dates";

interface StoricoProps {
  inventory: InventoryItem[];
  isLoading: boolean;
}

const Storico = ({ inventory, isLoading }: StoricoProps) => {
  const [filterDate, setFilterDate] = useState<Date | null | undefined>(null);

  const formatDate = (date: string) => {
    return dayjs(date).format("DD/MM/YYYY");
  };

  const filteredInventory = filterDate
    ? inventory.filter(item =>
      dayjs(item.dataultimomovimento).isSame(dayjs(filterDate), "day")
    )
    : inventory;

  return (
    <div>
      <div className="flex flex-start items-center flex-nowrap gap-3 mb-5">
        <label htmlFor="calendar" className="min-w-[140px]">Data movimento:</label>
        <DatePickerInput
          value={filterDate}
          onChange={setFilterDate}
          valueFormat="DD/MM/YYYY"
          clearable
          className="w-full"
        />
      </div>

      <DataTable
        value={filteredInventory}
        loading={isLoading}
        size="small"
        rows={10}
        totalRecords={filteredInventory.length}
        showGridlines
        paginator
        removableSort
        emptyMessage="Nessun dato disponibile"
      >
        <Column field="codice" header="Codice" sortable />
        <Column field="descrizionebreve" header="Descrizione" sortable />
        <Column field="unitaDiMisura" header="Unità di misura" sortable />
        <Column field="dataultimomovimento" header="Movimento" sortable body={(rowData: InventoryItem) => formatDate(rowData.dataultimomovimento)} />
      </DataTable>
    </div>
  );
};

export default Storico;
