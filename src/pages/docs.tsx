import withAuthentication from '@/components/WithAuth'
import DevDocs from '@/components/DevDocs';

const IndexPage = () => {
	return <DevDocs />
}

export default withAuthentication(IndexPage)