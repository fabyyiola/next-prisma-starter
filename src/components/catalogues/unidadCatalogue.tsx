import React, { useEffect, useState } from 'react';
import { fetchUnidades } from '@/apiCalls/unidadApi';
import TableExt, { Tab, TableCell, TableRow } from '@/components/TableExt'; // Adjust the import path as necessary
import { Unidad } from '@/types/schema.types';
import { Modal } from '@/components/Modal';
import UnidadForm from '@/components/forms/unidadForm';
import { NotificationAlert } from '@/components/NotificationAlert';
import TableCards from '../TableCards';

const TABS: Tab[] = [];

const TABLE_HEAD = [
  'ID',
  'No Economico',
  'Placas',
  'Marca',
  'Modelo',
  'Tipo',
  'Ver Mecanica',
  'Ver Contaminantes',
  'Ver US',
  'Poliza US',
  'Poliza MX',
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

export default function UnidadCatalogue() {
  const [unidades, setUnidades] = useState<Unidad[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedUnidad, setSelectedUnidad] = useState<Unidad | null>(null);

  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'info' | 'warning' | 'error' | 'success'>('success');
  const [alertOpen, setAlertOpen] = useState<boolean>(false);

  const isMobile = useMediaQuery('(max-width: 600px)');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: any = await fetchUnidades();
        setUnidades(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching unidades:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddClick = () => {
    setSelectedUnidad(null);
    setIsOpen(!isOpen);
  };

  const handleSuccess = (newUnidad: Unidad | unknown) => {
    if (typeof newUnidad === 'object' && newUnidad !== null && 'ID' in newUnidad) {
      const updatedUnidad = newUnidad as Unidad;
      setUnidades((prevUnidades: Unidad[]) => {
        const index = prevUnidades.findIndex((unidad) => unidad.ID === updatedUnidad.ID);
        if (index !== -1) {
          // Replace the existing unidad with the updated unidad
          return [
            ...prevUnidades.slice(0, index),
            updatedUnidad,
            ...prevUnidades.slice(index + 1),
          ];
        } else {
          // Add the new unidad
          return [...prevUnidades, updatedUnidad];
        }
      });
      setAlertMessage('Unidad saved successfully');
      setAlertType('success');
      setAlertOpen(true);
    } else if (typeof newUnidad === 'number') {
      const unidadIdToDelete = newUnidad;
      setUnidades((prevUnidades: Unidad[]) => {
        return prevUnidades.filter((unidad) => unidad.ID !== unidadIdToDelete);
      });
      setAlertMessage('Unidad deleted successfully');
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

  const handleEditClick = (unidad: Unidad) => {
    setSelectedUnidad(unidad);
    setIsOpen(true);
  };

  const mapUnidadToTableRow = (unidad: Unidad): TableRow => ({
    cells: [
      { type: 'text', colName: 'ID', value: unidad.ID.toString() },
      { type: 'text', colName: 'NoEconomico', value: unidad.NoEconomico.toString() },
      { type: 'text', colName: 'Placas', value: unidad.Placas },
      { type: 'text', colName: 'Marca', value: unidad.Marca },
      { type: 'text', colName: 'Modelo', value: unidad.Modelo },
      { type: 'text', colName: 'Tipo', value: unidad.Tipo },
      { type: 'text', colName: 'VerMecanica', value: unidad.VerMecanica.toISOString().split('T')[0] },
      { type: 'text', colName: 'VerContaminantes', value: unidad.VerContaminantes.toISOString().split('T')[0] },
      { type: 'text', colName: 'VerUS', value: unidad.VerUS.toISOString().split('T')[0] },
      { type: 'text', colName: 'PolizaUS', value: unidad.PolizaUS.toISOString().split('T')[0] },
      { type: 'text', colName: 'PolizaMX', value: unidad.PolizaMX.toISOString().split('T')[0] },
    ],
  });

  const tableRows: TableRow[] = unidades.map(mapUnidadToTableRow);

  return (
    <div style={{ overflow: 'auto' }}>
      {isMobile ? (
        <TableCards
          tabs={TABS}
          title="Listado de unidades"
          subtitle="En este modulo usted puede crear, modificar, eliminar o desactivar unidades."
          tableHead={TABLE_HEAD}
          tableRows={tableRows}
          showEditButton={true}
          handleAddClick={handleAddClick}
          handleEditClick={handleEditClick}
          addRecordButtonText={'Agregar unidad'}
          showAddRecordButton={true}
          showSearchInput={true}
        />
      ) : (
        <TableExt
          tabs={TABS}
          title="Listado de unidades"
          subtitle="En este modulo usted puede crear, modificar, eliminar o desactivar unidades."
          tableHead={TABLE_HEAD}
          tableRows={tableRows}
          showEditButton={true}
          handleAddClick={handleAddClick}
          handleEditClick={handleEditClick}
          addRecordButtonText={'Agregar unidad'}
          showAddRecordButton={true}
          showSearchInput={true}
        />
      )}
      <Modal
        headerText={'Agregar unidad'}
        size={'md'}
        isOpen={isOpen}
        handleOpen={handleAddClick}
      >
        <UnidadForm unidad={selectedUnidad} onSuccess={handleSuccess} onError={handleError} />
      </Modal>
      {alertMessage && (
        <NotificationAlert message={alertMessage} type={alertType} open={alertOpen} setOpen={setAlertOpen} />
      )}
    </div>
  );
}
