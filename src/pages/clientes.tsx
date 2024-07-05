import ClientCatalogue from '@/components/catalogues/client'
import withAuthentication from '@/components/WithAuth'

const IndexPage = () => {
	return <ClientCatalogue />
}

export default withAuthentication(IndexPage)