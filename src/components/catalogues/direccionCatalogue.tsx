import React, { useEffect, useState } from 'react';
import { fetchDirecciones } from '@/apiCalls/direccionApi';
import TableExt, { Tab, TableCell, TableRow } from '@/components/TableExt'; // Adjust the import path as necessary
import { Direccion } from '@/types/schema.types';
import { Modal } from '@/components/Modal';
import DireccionForm from '@/components/forms/direccionForm';
import { NotificationAlert } from '@/components/NotificationAlert';
import TableCards from '../TableCards';

const TABS: Tab[] = [];

const TABLE_HEAD = [
  'ID',
  'Nombre',
  'Calle',
  'Ciudad',
  'Estado',
  'Codigo Postal',
  'Referencias',
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

export default function DireccionCatalogue() {
  const [direcciones, setDirecciones] = useState<Direccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedDireccion, setSelectedDireccion] = useState<Direccion | null>(null);

  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'info' | 'warning' | 'error' | 'success'>('success');
  const [alertOpen, setAlertOpen] = useState<boolean>(false);

  const isMobile = useMediaQuery('(max-width: 600px)');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: any = await fetchDirecciones();
        setDirecciones(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching direcciones:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddClick = () => {
    setSelectedDireccion(null);
    setIsOpen(!isOpen);
  };

  const handleSuccess = (newDireccion: Direccion | unknown) => {
    if (typeof newDireccion === 'object' && newDireccion !== null && 'ID' in newDireccion) {
      const updatedDireccion = newDireccion as Direccion;
      setDirecciones((prevDirecciones: Direccion[]) => {
        const index = prevDirecciones.findIndex((direccion) => direccion.ID === updatedDireccion.ID);
        if (index !== -1) {
          // Replace the existing direccion with the updated direccion
          return [
            ...prevDirecciones.slice(0, index),
            updatedDireccion,
            ...prevDirecciones.slice(index + 1),
          ];
        } else {
          // Add the new direccion
          return [...prevDirecciones, updatedDireccion];
        }
      });
      setAlertMessage('Direccion saved successfully');
      setAlertType('success');
      setAlertOpen(true);
    } else if (typeof newDireccion === 'number') {
      const direccionIdToDelete = newDireccion;
      setDirecciones((prevDirecciones: Direccion[]) => {
        return prevDirecciones.filter((direccion) => direccion.ID !== direccionIdToDelete);
      });
      setAlertMessage('Direccion deleted successfully');
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

  const handleEditClick = (direccion: Direccion) => {
    setSelectedDireccion(direccion);
    setIsOpen(true);
  };

  const mapDireccionToTableRow = (direccion: Direccion): TableRow => ({
    cells: [
      { type: 'text', colName: 'ID', value: direccion.ID.toString() },
      { type: 'text', colName: 'Nombre', value: direccion.Nombre },
      { type: 'text', colName: 'Calle', value: direccion.Calle },
      { type: 'text', colName: 'Ciudad', value: direccion.Ciudad },
      { type: 'text', colName: 'Estado', value: direccion.Estado },
      { type: 'text', colName: 'CodigoPostal', value: direccion.CodigoPostal },
      { type: 'text', colName: 'Referencias', value: direccion.Referencias || '' },
    ],
  });

  const tableRows: TableRow[] = direcciones.map(mapDireccionToTableRow);

  return (
    <div style={{ overflow: 'auto' }}>
      {isMobile ? (
        <TableCards
          tabs={TABS}
          title="Listado de direcciones"
          subtitle="En este modulo usted puede crear, modificar, eliminar o desactivar direcciones."
          tableHead={TABLE_HEAD}
          tableRows={tableRows}
          showEditButton={true}
          handleAddClick={handleAddClick}
          handleEditClick={handleEditClick}
          addRecordButtonText={'Agregar direccion'}
          showAddRecordButton={true}
          showSearchInput={true}
        />
      ) : (
        <TableExt
          tabs={TABS}
          title="Listado de direcciones"
          subtitle="En este modulo usted puede crear, modificar, eliminar o desactivar direcciones."
          tableHead={TABLE_HEAD}
          tableRows={tableRows}
          showEditButton={true}
          handleAddClick={handleAddClick}
          handleEditClick={handleEditClick}
          addRecordButtonText={'Agregar direccion'}
          showAddRecordButton={true}
          showSearchInput={true}
        />
      )}
      <Modal
        headerText={'Agregar direccion'}
        size={'md'}
        isOpen={isOpen}
        handleOpen={handleAddClick}
      >
        <DireccionForm direccion={selectedDireccion} onSuccess={handleSuccess} onError={handleError} />
      </Modal>
      {alertMessage && (
        <NotificationAlert message={alertMessage} type={alertType} open={alertOpen} setOpen={setAlertOpen} />
      )}
    </div>
  );
}
