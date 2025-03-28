import { useState } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { TabView, TabPanel } from 'primereact/tabview';
import Inventario from '../components/Inventario';
import Storico from '../components/Storico';
import { InventoryItem, Warehouse } from "../types/types";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from 'primereact/dialog';

const Home = () => {
  const warehouses: Warehouse[] = [
    { name: "Gruppo Viva", uid: "02841d40-54a7-4f8d-b830-6b436a196bfd" },
    { name: "Paredes", uid: "ecbfd911-5564-4298-9e92-637f76a3f6e6" }
  ];

  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isErrorDialogVisible, setIsErrorDialogVisible] = useState(false);

  // Funzione per caricare i dati dell'inventario
  const fetchInventory = async () => {
    if (!selectedWarehouseId) return;
    setIsLoading(true);

    try {
      const response = await axios.get<InventoryItem[]>(`https://www.ibralogistics.it/api/ioFatturo_Articolo/ListAllEntities/uidAzienda/${selectedWarehouseId}`);

      const unitResponse = await axios.get(`https://www.ibralogistics.it/api/ioFatturo_TipoUnitaDiMisura/list/uidAzienda/${selectedWarehouseId}`);
      const units = JSON.parse(unitResponse.data.obj);

      const unitMap: Record<string, string> = {};
      units.forEach((unit: { uid: string; descrizione: string }) => {
        unitMap[unit.uid] = unit.descrizione;
      });

      const updatedInventory = response.data.map(item => ({
        ...item,
        descrizionebreve: item.descrizionebreve.trim(),
        unitaDiMisura: unitMap[item.uidtipounitadimisura] || "Non disponibile"
      }));

      setInventory(updatedInventory);
    } catch (error) {
      console.error("Errore nel caricamento:", error);
      setErrorMessage("Si è verificato un errore durante il caricamento del magazzino.");
      setIsErrorDialogVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { title: 'Inventario', icon: "pi pi-box mr-2", content: <Inventario inventory={inventory} isLoading={isLoading} /> },
    { title: 'Storico Movimenti', icon: "pi pi-history mr-2", content: <Storico inventory={inventory} isLoading={isLoading} /> }
  ];

  return (
    <div className="flex justify-center items-center w-full h-screen p-4">
      <div>
        <h1 className="mb-12">Pannello Supervisore Magazzino Ibra Logistics</h1>

        {/* Selezione magazzino + Pulsante ricerca */}
        <div className="flex justify-center gap-3 mt-5">
          <Dropdown
            value={selectedWarehouseId}
            options={warehouses}
            optionLabel="name"
            optionValue="uid"
            onChange={(e) => setSelectedWarehouseId(e.value)}
            placeholder="Seleziona un magazzino"
            className="w-2xs text-start"
          />
          <Button
            label="Cerca"
            icon="pi pi-search"
            onClick={fetchInventory}
            disabled={!selectedWarehouseId || isLoading}
          />
        </div>

        {/* Tabs */}
        <TabView activeIndex={activeTab} onTabChange={(e) => setActiveTab(e.index)} className="mt-5 w-full" style={{ padding: 0 }}>
          {tabs.map((tab, index) => (
            <TabPanel leftIcon={tab.icon} header={tab.title} key={index} style={{ padding: 0 }}>
              {tab.content}
            </TabPanel>
          ))}
        </TabView>

        <Dialog
          header="Errore"
          visible={isErrorDialogVisible}
          onHide={() => setIsErrorDialogVisible(false)}
          footer={<Button label="Chiudi" onClick={() => setIsErrorDialogVisible(false)} />}
        >
          <p>{errorMessage}</p>
        </Dialog>
      </div>
    </div>
  );
};

export default Home;
