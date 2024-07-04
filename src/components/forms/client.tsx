import { useState, useEffect, ChangeEvent } from 'react'
import {
	createClient,
	updateClient,
	deleteClient,
	fetchRegimenFiscales,
} from '@/apiCalls'
import { Cliente } from '@/types/schema.types'
import InputNewSearch, { Option } from '@/components/InputNewSearch'
import RegimenFiscalForm from '@/components/forms/regimenFiscal'

interface ClientFormProps {
	onSuccess?: (data: Cliente | unknown) => void
	onError?: (error: string) => void
	client?: Cliente | null
}

export default function ClientForm({
	onSuccess,
	onError,
	client = null,
}: ClientFormProps) {
	const [formData, setFormData] = useState<Cliente>({
		ID: NaN,
		Nombre: '',
		Calle: '',
		Ciudad: '',
		Estado: '',
		CodigoPostal: '',
		RFC: '',
		RegimenFiscal: '',
	})

	const [regimenesFiscales, setRegimenesFiscales] = useState<
		{ text: string; value: string }[]
	>([])

	useEffect(() => {
		if (client) {
			setFormData(client)
		}
	}, [client])

	const loadRegimenesFiscales = async () => {
		try {
			const response: any = await fetchRegimenFiscales()
			const options = response.map((regimen: { Nombre: string }) => ({
				text: regimen.Nombre,
				value: regimen.Nombre,
			}))
			// Sort the options alphabetically
			options.sort((a:Option, b:Option) => a.text.localeCompare(b.text))
			setRegimenesFiscales(options)
		} catch (error) {
			if (onError) {
				onError('Failed to fetch regimenes fiscales')
			}
		}
	}

	useEffect(() => {
		loadRegimenesFiscales()
	}, [onError])

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData({ ...formData, [name]: value })
	}

	const handleDropdownChange = (e: ChangeEvent<HTMLSelectElement>) => {
		const { name, value } = e.target
		setFormData({ ...formData, [name]: value })
	}

	const handleDelete = async () => {
		try {
			let response: Cliente | unknown = undefined
			if (client && client.ID) {
				response = await deleteClient(client.ID)
				if (onSuccess) {
					onSuccess(client.ID)
				}
			} else {
				throw 'Unhandled error: Client ID is missing'
			}
		} catch (error) {
			if (onError) {
				onError(`Error deleting client: ${error}`)
			}
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		e.stopPropagation() // Prevent event from propagating to the parent form
		try {
			let response: Cliente | unknown = undefined
			if (client) {
				response = await updateClient(formData.ID, formData)
				if (onSuccess) {
					onSuccess(response)
				}
			} else {
				response = await createClient(formData)
				if (onSuccess) {
					onSuccess(response)
				}
			}
		} catch (error) {
			if (onError) {
				onError(`Unhandled error: ${error}`)
			}
		}
	}

	return (
		<div className="mx-auto bg-white rounded-md">
			<form onSubmit={handleSubmit}>
				<div className="flex flex-wrap -mx-2">
					{[
						{
							label: 'Nombre',
							placeholder: 'Nombre',
							name: 'Nombre',
							type: 'text',
						},
						{
							label: 'Calle y num',
							placeholder: 'Calle y num',
							name: 'Calle',
							type: 'text',
						},
						{
							label: 'Ciudad',
							placeholder: 'Ciudad',
							name: 'Ciudad',
							type: 'text',
						},
						{
							label: 'Estado',
							placeholder: 'Estado',
							name: 'Estado',
							type: 'text',
						},
						{
							label: 'Codigo Postal',
							placeholder: 'Codigo Postal',
							name: 'CodigoPostal',
							type: 'text',
						},
						{ label: 'RFC', placeholder: 'RFC', name: 'RFC', type: 'text' },
					].map(({ label, placeholder, name, type }) => (
						<div key={name} className="w-full md:w-1/2 px-2 mb-4">
							<label className="block text-sm font-medium text-gray-700">
								<span className="text-red-500">*</span> {label}:
							</label>
							<input
								type={type}
								name={name}
								placeholder={placeholder}
								value={formData[name as keyof Cliente]}
								onChange={handleChange}
								className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
							/>
						</div>
					))}
					<div className="w-full md:w-1/2 px-2 mb-4">
						<InputNewSearch
							label="Regimen fiscal"
							options={regimenesFiscales}
							name="RegimenFiscal"
							value={formData.RegimenFiscal}
							onChange={handleDropdownChange}
							newNode={<RegimenFiscalForm onSuccess={loadRegimenesFiscales} />}
							newModalTitle="Agregar regimen fiscal"
							searchModalTitle="Buscar regimen fiscal"
							searchNode={<>Search Node</>}
							onNewSuccess={loadRegimenesFiscales} // Pass this prop to refresh the dropdown
						/>
					</div>
				</div>
				<div className="flex justify-end space-x-4">
					{client && (
						<>
							<button
								onClick={handleDelete}
								type="button"
								className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none"
							>
								Eliminar
							</button>
						</>
					)}
					<button
						type="submit"
						className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 focus:outline-none"
					>
						{client ? 'Actualizar' : 'Guardar'}
					</button>
				</div>
			</form>
		</div>
	)
}
