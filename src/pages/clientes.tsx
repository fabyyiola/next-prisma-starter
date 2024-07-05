import ClientCatalogue from '@/components/catalogues/clientCatalogue'
import withAuthentication from '@/components/WithAuth'

const IndexPage = () => {
	return <ClientCatalogue />
}

export default withAuthentication(IndexPage)