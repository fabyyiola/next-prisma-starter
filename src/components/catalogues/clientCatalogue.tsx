import React, { useEffect, useState } from 'react';
import { fetchClients } from '@/apiCalls/clientApi';
import TableExt, { Tab, TableCell, TableRow } from '@/components/TableExt'; // Adjust the import path as necessary
import { Cliente } from '@/types/schema.types';
import { Modal } from '@/components/Modal';
import ClientForm from '@/components/forms/clientForm';
import { NotificationAlert } from '@/components/NotificationAlert';
import TableCards from '../TableCards';

const TABS: Tab[] = [
  {
    label: 'Agua',
    value: 'agua',
    columnIndex: 4,
  },
  {
    label: 'P.Mor',
    value: 'moral',
    columnIndex: 7,
  },
];

const TABLE_HEAD = [
  'ID',
  'Nombre',
  'Calle',
  'Ciudad',
  'Estado',
  'CP',
  'RFC',
  'Regimen Fiscal',
];

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);

    // Initial check
    setMatches(mediaQuery.matches);

    // Add listener
    mediaQuery.addEventListener('change', handler);

    // Clean up listener on component unmount
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
};

export default function ClientCatalogue() {
  const [clients, setClients] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null);

  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'info' | 'warning' | 'error' | 'success'>('success');
  const [alertOpen, setAlertOpen] = useState<boolean>(false);

  const isMobile = useMediaQuery('(max-width: 600px)');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: any = await fetchClients();
        setClients(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching clients:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddClick = () => {
    setSelectedClient(null);
    setIsOpen(!isOpen);
  };

  const handleSuccess = (newClient: Cliente | unknown) => {
    if (typeof newClient === 'object' && newClient !== null && 'ID' in newClient) {
      const updatedClient = newClient as Cliente;
      setClients((prevClients: Cliente[]) => {
        const index = prevClients.findIndex((client) => client.ID === updatedClient.ID);
        if (index !== -1) {
          // Replace the existing client with the updated client
          return [
            ...prevClients.slice(0, index),
            updatedClient,
            ...prevClients.slice(index + 1),
          ];
        } else {
          // Add the new client
          return [...prevClients, updatedClient];
        }
      });
      setAlertMessage('Client saved successfully');
      setAlertType('success');
      setAlertOpen(true);
    } else if (typeof newClient === 'number') {
      const clientIdToDelete = newClient;
      setClients((prevClients: Cliente[]) => {
        return prevClients.filter((client) => client.ID !== clientIdToDelete);
      });
      setAlertMessage('Client deleted successfully');
      setAlertType('success');
      setAlertOpen(true);
    }
    setIsOpen(false);
  };

  const handleError = (error: string) => {
    setAlertMessage(error);
    setAlertType('error');
    setAlertOpen(true);
  };

  const handleEditClick = (client: Cliente) => {
    setSelectedClient(client);
    setIsOpen(true);
  };

  const mapClientToTableRow = (client: Cliente): TableRow => ({
    cells: [
      { type: 'text', colName: 'ID', value: client.ID.toString() },
      { type: 'text', colName: 'Nombre', value: client.Nombre },
      { type: 'text', colName: 'Calle', value: client.Calle },
      { type: 'text', colName: 'Ciudad', value: client.Ciudad },
      { type: 'text', colName: 'Estado', value: client.Estado },
      { type: 'text', colName: 'CodigoPostal', value: client.CodigoPostal },
      { type: 'text', colName: 'RFC', value: client.RFC },
      { type: 'text', colName: 'RegimenFiscal', value: client.RegimenFiscal },
    ],
  });

  const tableRows: TableRow[] = clients.map(mapClientToTableRow);

  return (
    <div style={{ overflow: 'auto' }}>
      {isMobile ? (
        <TableCards
          tabs={TABS}
          title="Listado de clientes"
          subtitle="En este modulo usted puede crear, modificar, eliminar o desactivar clientes."
          tableHead={TABLE_HEAD}
          tableRows={tableRows}
          showEditButton={true}
          handleAddClick={handleAddClick}
          handleEditClick={handleEditClick}
          addRecordButtonText={'Agregar cliente'}
          showAddRecordButton={true}
          showSearchInput={true}
        />
      ) : (
        <TableExt
          tabs={TABS}
          title="Listado de clientes"
          subtitle="En este modulo usted puede crear, modificar, eliminar o desactivar clientes."
          tableHead={TABLE_HEAD}
          tableRows={tableRows}
          showEditButton={true}
          handleAddClick={handleAddClick}
          handleEditClick={handleEditClick}
          addRecordButtonText={'Agregar cliente'}
          showAddRecordButton={true}
          showSearchInput={true}
        />
      )}
      <Modal
        headerText={'Agregar cliente'}
        size={'md'}
        isOpen={isOpen}
        handleOpen={handleAddClick}
      >
        <ClientForm client={selectedClient} onSuccess={handleSuccess} onError={handleError} />
      </Modal>
      {alertMessage && (
        <NotificationAlert message={alertMessage} type={alertType} open={alertOpen} setOpen={setAlertOpen} />
      )}
    </div>
  );
}
