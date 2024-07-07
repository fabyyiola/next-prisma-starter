import ClientCatalogue from '@/components/catalogues/clientCatalogue'
import EmpleadoForm from '@/components/forms/empleadoForm'
import withAuthentication from '@/components/WithAuth'

const IndexPage = () => {
	return <EmpleadoForm />
}

export default withAuthentication(IndexPage)