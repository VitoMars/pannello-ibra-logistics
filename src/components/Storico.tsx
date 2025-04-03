import { DataTable } from "primereact/datatable";
import { CausalMovements, MovementHistory } from "../types/types";
import { Column } from "primereact/column";
import dayjs from "dayjs";
import { useState } from "react";
import { DatePickerInput } from "@mantine/dates";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import axios from "axios";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useWarehouseStore } from "../store/useStore";

interface StoricoProps {
  isLoadingTable: boolean;
  UidAzienda: string;
  causalMovements: CausalMovements[];
}

const Storico = ({ isLoadingTable, UidAzienda, causalMovements }: StoricoProps) => {
  const selectedWarehouseId = useWarehouseStore((state) => state.selectedWarehouseId);
  const movementHistory = useWarehouseStore((state) => state.movementHistory);
  const setMovementHistory = useWarehouseStore((state) => state.setMovementHistory);

  const [startDate, setStartDate] = useState<Date | null>(dayjs().subtract(1, "month").toDate());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [codiceArticolo, setCodiceArticolo] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedCausalMovementId, setSelectedCausalMovementId] = useState<string | null>(null);

  const [isErrorDialogVisible, setIsErrorDialogVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    const formatData = (date: Date) => dayjs(date).format("YYYYMMDD");

    let params = `uidAzienda/${UidAzienda}`;
    if (startDate) params += `/DataMovimentoInizioYYYYMMDD/${formatData(startDate)}`;
    if (endDate) params += `/DataMovimentoFineYYYYMMDD/${formatData(endDate)}`;

    if (selectedCausalMovementId) {
      params += `/IdCausaleMovimento/${selectedCausalMovementId}`
    } else {
      params += `/IdCausaleMovimento/-1`
    }

    if (codiceArticolo) {
      params += `/CodiceArticolo/${codiceArticolo}`;
    } else {
      params += `/CodiceArticolo/-`;
    }

    try {
      const url = `https://www.ibralogistics.it/api/ioFatturo_MovimentoMagazzino/ListAllEntities/${params}`;
      const response = await axios.get<MovementHistory[]>(url);

      const unitResponse = await axios.get(`https://www.ibralogistics.it/api/ioFatturo_TipoUnitaDiMisura/list/uidAzienda/${selectedWarehouseId}`);
      const units = JSON.parse(unitResponse.data.obj);

      const unitMap: Record<string, string> = {};
      units.forEach((unit: { uid: string; descrizione: string }) => {
        unitMap[unit.uid] = unit.descrizione;
      });

      const updatedMovements = response.data.map(item => ({
        ...item,
        descrizionearticolo: item.descrizionearticolo.trim(),
        unitaDiMisura: unitMap[item.uidtipounitadimisura] || "Non disponibile"
      }));

      setMovementHistory(updatedMovements);
    } catch (error) {
      setErrorMessage("Si è verificato un errore durante il filtraggio.");
      setIsErrorDialogVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-start items-center flex-nowrap gap-3 mb-5">
        <label className="min-w-[140px]">Codice Articolo:</label>
        <InputText value={codiceArticolo} onChange={(e) => setCodiceArticolo(e.target.value)} placeholder="Inserisci il codice articolo" className="w-full" />
      </div>

      <div className="flex flex-start items-center flex-nowrap gap-3 mb-5">
        <label className="min-w-[140px]">Causale:</label>
        <Dropdown
          value={selectedCausalMovementId}
          options={[{ IDCausaleMovimento: null, Descrizione: "Tutte" }, ...causalMovements]}
          optionLabel="Descrizione"
          optionValue="IDCausaleMovimento"
          onChange={(e) => setSelectedCausalMovementId(e.value)}
          placeholder="Seleziona causuale movimento"
          className="w-full"
        />
      </div>

      <div className="flex flex-start items-center flex-nowrap gap-3 mb-5">
        <div className="flex items-center gap-3 w-1/2">
          <label className="min-w-[140px]">Data movimento inizio:</label>
          <DatePickerInput value={startDate} onChange={setStartDate} valueFormat="DD/MM/YYYY" size="lg" className="w-full" />
        </div>

        <div className="flex items-center gap-3 w-1/2">
          <label className="min-w-[140px]">Data movimento fine:</label>
          <DatePickerInput value={endDate} onChange={setEndDate} valueFormat="DD/MM/YYYY" size="lg" className="w-full" />
        </div>
      </div>

      <div className="flex justify-end mb-5">
        <Button
          label="Cerca"
          icon="pi pi-search"
          onClick={fetchData}
          disabled={isLoading || isLoadingTable || !selectedWarehouseId}
        />
      </div>

      <DataTable
        value={movementHistory}
        loading={isLoading || isLoadingTable}
        size="small"
        rows={10}
        paginator
        showGridlines
        removableSort
        emptyMessage="Nessun dato disponibile"
      >
        <Column field="codicearticolo" header="Codice" sortable />
        <Column field="descrizionearticolo" header="Articolo" sortable />
        <Column field="unitaDiMisura" header="U.d.M." sortable style={{ textAlign: "center" }} />
        <Column field="quantita" header="Q.ta movimentata" sortable />
        {/* <Column field="dataultimomovimento" header="Movimento" sortable body={rowData => formatDate(rowData.dataultimomovimento)} /> */}
        {/* <Column field="causale" header="Causale" sortable /> */}
        <Column field="note" header="Note" sortable />
      </DataTable>

      <Dialog
        header="Errore"
        visible={isErrorDialogVisible}
        onHide={() => setIsErrorDialogVisible(false)}
        footer={<Button label="Chiudi" onClick={() => setIsErrorDialogVisible(false)} />}
      >
        <p>{errorMessage}</p>
      </Dialog>
    </div>
  );
};

export default Storico;
