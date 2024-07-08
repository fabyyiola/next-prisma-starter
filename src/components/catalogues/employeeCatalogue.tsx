import React, { useEffect, useState } from 'react';
import { fetchEmpleados } from '@/apiCalls/empleadoApi';
import TableExt, { Tab, TableCell, TableRow } from '@/components/TableExt'; // Adjust the import path as necessary
import { Empleado } from '@/types/schema.types';
import { Modal } from '@/components/Modal';
import EmpleadoForm from '@/components/forms/empleadoForm';
import { NotificationAlert } from '@/components/NotificationAlert';
import TableCards from '../TableCards';

const TABS: Tab[] = [
  {
    label: 'Operativos',
    value: 'operativos',
    columnIndex: 9,
  },
  {
    label: 'Administrativos',
    value: 'administrativos',
    columnIndex: 10,
  },
];

const TABLE_HEAD = [
  'ID',
  'Nombre',
  'Direccion',
  'Telefono',
  'Email',
  'Nombre Conyuge',
  'Telefono Conyuge',
  'CURP',
  'RFC',
  'Apto Medico',
  'Licencia',
  'Tipo',
  'Sueldo Semanal',
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

export default function EmpleadoCatalogue() {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedEmpleado, setSelectedEmpleado] = useState<Empleado | null>(null);

  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'info' | 'warning' | 'error' | 'success'>('success');
  const [alertOpen, setAlertOpen] = useState<boolean>(false);

  const isMobile = useMediaQuery('(max-width: 600px)');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: any = await fetchEmpleados();
        setEmpleados(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching empleados:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddClick = () => {
    setSelectedEmpleado(null);
    setIsOpen(!isOpen);
  };

  const handleSuccess = (newEmpleado: Empleado | unknown) => {
    if (typeof newEmpleado === 'object' && newEmpleado !== null && 'ID' in newEmpleado) {
      const updatedEmpleado = newEmpleado as Empleado;
      setEmpleados((prevEmpleados: Empleado[]) => {
        const index = prevEmpleados.findIndex((empleado) => empleado.ID === updatedEmpleado.ID);
        if (index !== -1) {
          // Replace the existing empleado with the updated empleado
          return [
            ...prevEmpleados.slice(0, index),
            updatedEmpleado,
            ...prevEmpleados.slice(index + 1),
          ];
        } else {
          // Add the new empleado
          return [...prevEmpleados, updatedEmpleado];
        }
      });
      setAlertMessage('Empleado saved successfully');
      setAlertType('success');
      setAlertOpen(true);
    } else if (typeof newEmpleado === 'number') {
      const empleadoIdToDelete = newEmpleado;
      setEmpleados((prevEmpleados: Empleado[]) => {
        return prevEmpleados.filter((empleado) => empleado.ID !== empleadoIdToDelete);
      });
      setAlertMessage('Empleado deleted successfully');
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

  const handleEditClick = (empleado: Empleado) => {
    setSelectedEmpleado(empleado);
    setIsOpen(true);
  };

  const mapEmpleadoToTableRow = (empleado: Empleado): TableRow => ({
    cells: [
      { type: 'text', colName: 'ID', value: empleado.ID.toString() },
      { type: 'text', colName: 'Nombre', value: empleado.Nombre },
      { type: 'text', colName: 'Direccion', value: empleado.Direccion },
      { type: 'text', colName: 'Telefono', value: empleado.Telefono },
      { type: 'text', colName: 'Email', value: empleado.Email || '' },
      { type: 'text', colName: 'NombreConyuge', value: empleado.NombreConyuge || '' },
      { type: 'text', colName: 'TelefonoConyuge', value: empleado.TelefonoConyuge || '' },
      { type: 'text', colName: 'CURP', value: empleado.CURP },
      { type: 'text', colName: 'RFC', value: empleado.RFC },
      { type: 'text', colName: 'AptoMedico', value: empleado.AptoMedico.toString().split('T')[0] },
      { type: 'text', colName: 'Licencia', value: empleado.Licencia.toString().split('T')[0] },
      { type: 'text', colName: 'Tipo', value: empleado.Tipo },
      { type: 'text', colName: 'SueldoSemanal', value: empleado.SueldoSemanal.toString() },
    ],
  });

  const tableRows: TableRow[] = empleados.map(mapEmpleadoToTableRow);

  return (
    <div style={{ overflow: 'auto' }}>
      {isMobile ? (
        <TableCards
          tabs={TABS}
          title="Listado de empleados"
          subtitle="En este modulo usted puede crear, modificar, eliminar o desactivar empleados."
          tableHead={TABLE_HEAD}
          tableRows={tableRows}
          showEditButton={true}
          handleAddClick={handleAddClick}
          handleEditClick={handleEditClick}
          addRecordButtonText={'Agregar empleado'}
          showAddRecordButton={true}
          showSearchInput={true}
        />
      ) : (
        <TableExt
          tabs={TABS}
          title="Listado de empleados"
          subtitle="En este modulo usted puede crear, modificar, eliminar o desactivar empleados."
          tableHead={TABLE_HEAD}
          tableRows={tableRows}
          showEditButton={true}
          handleAddClick={handleAddClick}
          handleEditClick={handleEditClick}
          addRecordButtonText={'Agregar empleado'}
          showAddRecordButton={true}
          showSearchInput={true}
        />
      )}
      <Modal
        headerText={'Agregar empleado'}
        size={'md'}
        isOpen={isOpen}
        handleOpen={handleAddClick}
      >
        <EmpleadoForm empleado={selectedEmpleado} onSuccess={handleSuccess} onError={handleError} />
      </Modal>
      {alertMessage && (
        <NotificationAlert message={alertMessage} type={alertType} open={alertOpen} setOpen={setAlertOpen} />
      )}
    </div>
  );
}
