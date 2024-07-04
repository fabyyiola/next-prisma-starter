import { useState, useEffect, ChangeEvent } from 'react'
import {
	createRegimenFiscal,
	updateRegimenFiscal,
	deleteRegimenFiscal,
} from '@/apiCalls/regimenFiscalApi'
import { RegimenFiscal } from '@/types/schema.types'

interface RegimenFiscalFormProps {
	onSuccess?: (data: RegimenFiscal | unknown) => void
	onError?: (error: any) => void
	regimenFiscal?: RegimenFiscal | null // Made optional
}

export default function RegimenFiscalForm({
	onSuccess,
	onError,
	regimenFiscal = null, // Default to null if not provided
}: RegimenFiscalFormProps) {
	const [formData, setFormData] = useState<RegimenFiscal>({
		ID: NaN,
		Nombre: '',
	})

	useEffect(() => {
		if (regimenFiscal) {
			setFormData(regimenFiscal)
		}
	}, [regimenFiscal])

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData({ ...formData, [name]: value })
	}

	const handleDelete = async () => {
		try {
			let response: RegimenFiscal | unknown = undefined
			if (regimenFiscal && regimenFiscal.ID) {
				response = await deleteRegimenFiscal(regimenFiscal.ID)
				console.log(
					'RegimenFiscal ' +
						JSON.stringify(regimenFiscal) +
						' deleted successfully:',
					response
				)
				if (onSuccess) {
					onSuccess(regimenFiscal.ID)
				}
			} else {
				throw 'This should never show up in the console =D'
			}
		} catch (error) {
			console.error(`Error deleting regimenFiscal:`, error)
			if (onError) {
				onError(error)
			}
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		try {
			let response: RegimenFiscal | unknown = undefined
			if (regimenFiscal) {
				response = await updateRegimenFiscal(formData.ID, formData)
				console.log('RegimenFiscal updated successfully:', response)
			} else {
				response = await createRegimenFiscal(formData)
				console.log('RegimenFiscal created successfully:', response)
			}
			if (onSuccess) {
				onSuccess(response)
			}
		} catch (error) {
			console.error(
				`Error ${regimenFiscal ? 'updating' : 'creating'} regimenFiscal:`,
				error
			)
			if (onError) {
				onError(error)
			}
		}
	}

	return (
		<div className="mx-auto bg-white rounded-md">
			<form onSubmit={handleSubmit}>
				<div className="w-full px-2 mb-4">
					<label className="block text-sm font-medium text-gray-700">
						<span className="text-red-500">*</span> Nombre:
					</label>
					<input
						type="text"
						name="Nombre"
						placeholder="Nombre"
						value={formData.Nombre}
						onChange={handleChange}
						className="w-full mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
					/>
				</div>
				<div className="flex justify-end space-x-4">
					{regimenFiscal && (
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
						{regimenFiscal ? 'Actualizar' : 'Guardar'}
					</button>
				</div>
			</form>
		</div>
	)
}
