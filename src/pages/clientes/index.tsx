import React, { useEffect, useState } from 'react';
import { fetchClients } from '@/apiCalls/clientApi';
import TableExt, { Tab, TableCell, TableRow } from '@/components/TableExt'; // Adjust the import path as necessary
import { Cliente } from '@/types/schema.types';
import { Modal, ModalSize } from '@/components/Modal';
import ClientForm from '@/components/forms/client';

const TABS:Tab[] = [
  {
    label: 'EdoMX',
    value: 'Edo mexico',
    columnIndex:3,
  },
  {
    label: 'NL',
    value: 'NL',
    columnIndex:3,
  },
];

const TABLE_HEAD = [
  'Nombre',
  'Calle',
  'Ciudad',
  'Estado',
  'Código Postal',
  'RFC',
  'Regimen Fiscal',
];

const IndexPage = () => {
  const [clients, setClients] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedClient, setSelectedClient] = useState<Cliente|null>(null);
  
  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

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

  const handleSuccess = (newClient: Cliente) => {
    setClients((prevClients) => [...prevClients, newClient]);
    setIsOpen(false);
  };

  const handleEditClick = (client: Cliente) => {
    setSelectedClient(client);
    setIsOpen(true);
  };

  const mapClientToTableRow = (client: Cliente): TableRow => ({
    cells: [
      { type: 'text', value: client.Nombre },
      { type: 'text', value: client.Calle },
      { type: 'text', value: client.Ciudad },
      { type: 'text', value: client.Estado },
      { type: 'text', value: client.CodigoPostal },
      { type: 'text', value: client.RFC },
      { type: 'text', value: client.RegimenFiscal },
    ],
  });

  const tableRows: TableRow[] = clients.map(mapClientToTableRow);

  return (
    <div>
      <TableExt
        tabs={TABS}
        title="Clients List"
        subtitle="See information about all clients"
        tableHead={TABLE_HEAD}
        tableRows={tableRows}
        showEditButton={true}
        handleOpen={handleOpen}
        handleEditClick={handleEditClick}
        addRecordButtonText={"Agregar cliente"}
        showAddRecordButton={true}
        showSearchInput={true}
      />
      <Modal headerText={"Agregar cliente"} size={'md'} isOpen={isOpen} handleOpen={handleOpen}>
        <ClientForm client={selectedClient} onSuccess={handleSuccess} />
      </Modal>
    </div>
  );
};

export default IndexPage;
