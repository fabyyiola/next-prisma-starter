import UnidadCatalogue from '@/components/catalogues/unidadCatalogue'
import withAuthentication from '@/components/WithAuth'

const IndexPage = () => {
	return <UnidadCatalogue />
}

export default withAuthentication(IndexPage)