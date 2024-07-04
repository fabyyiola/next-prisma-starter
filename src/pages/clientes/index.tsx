import React, { useEffect, useState } from 'react'
import { fetchClients } from '@/apiCalls/clientApi'
import TableExt, { Tab, TableCell, TableRow } from '@/components/TableExt' // Adjust the import path as necessary
import { Cliente } from '@/types/schema.types'
import { Modal } from '@/components/Modal'
import ClientForm from '@/components/forms/client'

const TABS: Tab[] = [
	{
		label: 'EdoMX',
		value: 'Edo mexico',
		columnIndex: 4,
	},
	{
		label: 'NL',
		value: 'NL',
		columnIndex: 4,
	},
]

const TABLE_HEAD = [
	'ID',
	'Nombre',
	'Calle',
	'Ciudad',
	'Estado',
	'Código Postal',
	'RFC',
	'Regimen Fiscal',
]

const IndexPage = () => {
	const [clients, setClients] = useState<Cliente[]>([])
	const [loading, setLoading] = useState(true)
	const [isOpen, setIsOpen] = useState<boolean>(false)
	const [selectedClient, setSelectedClient] = useState<Cliente | null>(null)

	useEffect(() => {
		const fetchData = async () => {
			try {
				const data: any = await fetchClients()
				setClients(data)
				setLoading(false)
			} catch (error) {
				console.error('Error fetching clients:', error)
				setLoading(false)
			}
		}

		fetchData()
	}, [])

	const handleAddClick = () => {
    setSelectedClient(null)
		setIsOpen(!isOpen)
	}

	const handleSuccess = (newClient: Cliente | unknown) => {
    if (typeof newClient === 'object' && newClient !== null && 'ID' in newClient) {
        const updatedClient = newClient as Cliente;
        setClients((prevClients: Cliente[]) => {
            const index = prevClients.findIndex(client => client.ID === updatedClient.ID);
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
    }
    setIsOpen(false);
};

	const handleEditClick = (client: Cliente) => {
		setSelectedClient(client)
		setIsOpen(true)
	}

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
	})

	const tableRows: TableRow[] = clients.map(mapClientToTableRow)

	return (
		<div>
			<TableExt
				tabs={TABS}
				title="Clients List"
				subtitle="See information about all clients"
				tableHead={TABLE_HEAD}
				tableRows={tableRows}
				showEditButton={true}
				handleAddClick={handleAddClick}
				handleEditClick={handleEditClick}
				addRecordButtonText={'Agregar cliente'}
				showAddRecordButton={true}
				showSearchInput={true}
			/>
			<Modal
				headerText={'Agregar cliente'}
				size={'md'}
				isOpen={isOpen}
				handleOpen={handleAddClick}
			>
				<ClientForm client={selectedClient} onSuccess={handleSuccess} />
			</Modal>
		</div>
	)
}

export default IndexPage
