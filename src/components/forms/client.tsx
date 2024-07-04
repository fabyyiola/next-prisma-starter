import { useState, useEffect, ChangeEvent } from 'react'
import { createClient, updateClient, deleteClient } from '@/apiCalls'
import { Cliente } from '@/types/schema.types'
import InputNewSearch from '../InputNewSearch'

interface ClientFormProps {
	onSuccess?: (data: Cliente | unknown) => void
	onError?: (error: any) => void
	client: Cliente | null
}

export default function ClientForm({
	onSuccess,
	onError,
	client,
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

	useEffect(() => {
		if (client) {
			setFormData(client)
		}
	}, [client])

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData({ ...formData, [name]: value })
	}

	const handleDelete = async () => {
		try {
			let response: Cliente | unknown = undefined
			if (client && client.ID) {
				response = await deleteClient(client.ID)
				console.log(
					'Client ' + JSON.stringify(client) + ' deleted successfully:',
					response
				)
				if (onSuccess) {
					onSuccess(client.ID)
				}
			} else {
				throw 'This should never show up in the console =D'
			}
		} catch (error) {
			console.error(`Error ${client ? 'updating' : 'creating'} client:`, error)
			if (onError) {
				onError(error)
			}
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		try {
			let response: Cliente | unknown = undefined
			if (client) {
				response = await updateClient(formData.ID, formData)
				console.log('Client updated successfully:', response)
			} else {
				response = await createClient(formData)
				console.log('Client created successfully:', response)
			}
			if (onSuccess) {
				onSuccess(response)
			}
		} catch (error) {
			console.error(`Error ${client ? 'updating' : 'creating'} client:`, error)
			if (onError) {
				onError(error)
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
							placeholder="RESICO, Serv. Profesionales, etc"
							name="RegimenFiscal"
							value={formData.RegimenFiscal}
							onChange={handleChange}
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
						{client ? "Actualizar" : "Guardar"}
					</button>
				</div>
			</form>
		</div>
	)
}
