import { useState, useEffect, ChangeEvent } from 'react'
import { createUnidad, updateUnidad, deleteUnidad } from '@/apiCalls/unidadApi'
import { Unidad } from '@/types/schema.types'
import InputText from '@/components/InputText'
import InputNumber from '@/components/InputNumber'
import InputDate from '@/components/InputDate'
import { formatDateToYYYYMMDD } from '@/utils/tools'

interface UnidadFormProps {
	onSuccess?: (data: Unidad | unknown) => void
	onError?: (error: string) => void
	unidad?: Unidad | null
}

export default function UnidadForm({
	onSuccess,
	onError,
	unidad = null,
}: UnidadFormProps) {
	const [formData, setFormData] = useState<Unidad>({
		ID: NaN,
		NoEconomico: 0,
		Placas: '',
		Marca: '',
		Modelo: '',
		Tipo: '',
		VerMecanica: new Date(),
		VerContaminantes: new Date(),
		VerUS: new Date(),
		PolizaUS: new Date(),
		PolizaMX: new Date(),
	})

	const [errors, setErrors] = useState<{ [key: string]: string }>({})

	const requiredFields = [
		'NoEconomico',
		'Placas',
		'Marca',
		'Modelo',
		'Tipo',
		'VerMecanica',
		'VerContaminantes',
		'VerUS',
		'PolizaUS',
		'PolizaMX',
	]

	useEffect(() => {
		if (unidad) {
			console.log('Setting unidad data:', unidad)
			setFormData({
				...unidad,
				VerMecanica: new Date(unidad.VerMecanica),
				VerContaminantes: new Date(unidad.VerContaminantes),
				VerUS: new Date(unidad.VerUS),
				PolizaUS: new Date(unidad.PolizaUS),
				PolizaMX: new Date(unidad.PolizaMX),
			})
		}
	}, [unidad])

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		console.log(`handleChange ${name} to ${value}`,formData)
		setFormData({
			...formData,
			[name]: name === 'NoEconomico' ? parseInt(value) : value,
		})
		setErrors({ ...errors, [name]: '' }) // Clear error message when user starts typing
	}

	const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		console.log(`handleDateChange ${name} to ${value}`,formData)
		setFormData({ ...formData, [name]: new Date(value) })
		setErrors({ ...errors, [name]: '' }) // Clear error message when user starts typing
	}

	const handleDelete = async () => {
		try {
			if (unidad && unidad.ID) {
				console.log('Deleting unidad with ID:', unidad.ID)
				await deleteUnidad(unidad.ID)
				if (onSuccess) {
					onSuccess(unidad.ID)
				}
			} else {
				throw 'Unhandled error: Unidad ID is missing'
			}
		} catch (error) {
			console.error('Error deleting unidad:', error)
			if (onError) {
				onError(`Error deleting unidad: ${error}`)
			}
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		e.stopPropagation() // Prevent event from propagating to the parent form

		console.log('Form submitted with data:', formData)

		const newErrors: { [key: string]: string } = {}

		requiredFields.forEach((field) => {
			if (!formData[field as keyof Unidad]) {
				newErrors[field] = `${field} is required`
			}
		})

		if (Object.keys(newErrors).length > 0) {
			console.log('Validation errors:', newErrors)
			setErrors(newErrors)
			return
		}

		try {
			let response: Unidad | unknown = undefined
			if (unidad) {
				console.log('Updating unidad with data:', formData)
				response = await updateUnidad(formData.ID, formData)
			} else {
				console.log('Creating new unidad with data:', formData)
				response = await createUnidad(formData)
			}
			if (onSuccess) {
				console.log('Operation successful, response:', response)
				onSuccess(response)
			}
		} catch (error) {
			console.error('Unhandled error:', error)
			if (onError) {
				onError(`Unhandled error: ${error}`)
			}
		}
	}

	return (
		<div className="mx-auto bg-white rounded-md p-6">
			<form onSubmit={handleSubmit}>
				<div className="flex flex-wrap -mx-2">
					{[
						{
							label: 'No Economico',
							placeholder: 'No Economico',
							name: 'NoEconomico',
							type: 'number',
						},
						{
							label: 'Placas',
							placeholder: 'Placas',
							name: 'Placas',
							type: 'text',
						},
						{
							label: 'Marca',
							placeholder: 'Marca',
							name: 'Marca',
							type: 'text',
						},
						{
							label: 'Modelo',
							placeholder: 'Modelo',
							name: 'Modelo',
							type: 'text',
						},
						{ label: 'Tipo', placeholder: 'Tipo', name: 'Tipo', type: 'text' },
						{
							label: 'Ver Mecanica',
							placeholder: 'Ver Mecanica',
							name: 'VerMecanica',
							type: 'date',
						},
						{
							label: 'Ver Contaminantes',
							placeholder: 'Ver Contaminantes',
							name: 'VerContaminantes',
							type: 'date',
						},
						{
							label: 'Ver US',
							placeholder: 'Ver US',
							name: 'VerUS',
							type: 'date',
						},
						{
							label: 'Poliza US',
							placeholder: 'Poliza US',
							name: 'PolizaUS',
							type: 'date',
						},
						{
							label: 'Poliza MX',
							placeholder: 'Poliza MX',
							name: 'PolizaMX',
							type: 'date',
						},
					].map(({ label, placeholder, name, type }) => (
						<div key={name} className="w-full md:w-1/2 px-2 mb-4">
							{type === 'text' && (
								<InputText
									label={label}
									name={name}
									placeholder={placeholder}
									value={String(formData[name as keyof Unidad] ?? '')}
									required={requiredFields.includes(name)}
									error={errors[name]}
									onChange={handleChange}
								/>
							)}
							{type === 'number' && (
								<InputNumber
									label={label}
									name={name}
									placeholder={placeholder}
									value={Number(formData[name as keyof Unidad] ?? 0)}
									required={requiredFields.includes(name)}
									error={errors[name]}
									onChange={handleChange}
								/>
							)}
							{type === 'date' && (
								<InputDate
									label={label}
									name={name}
									placeholder={placeholder}
									value={formatDateToYYYYMMDD(
										formData[name as keyof Unidad]
									)}
									required={requiredFields.includes(name)}
									error={errors[name]}
									onChange={handleDateChange}
								/>
							)}
						</div>
					))}
				</div>
				<div className="flex justify-end space-x-4">
					{unidad && (
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
						{unidad ? 'Actualizar' : 'Guardar'}
					</button>
				</div>
			</form>
		</div>
	)
}
