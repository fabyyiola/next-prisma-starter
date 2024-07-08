// src/components/withAuthentication.tsx
import React, { useState, useEffect } from 'react'
import { useAuth0, User } from '@auth0/auth0-react'
import { useRouter } from 'next/router'
import { ScaleLoader } from 'react-spinners'
import { createUser, fetchUserByEmail } from '@/apiCalls'
import AlertMessage from './AlertMessage'

async function isAuthorized(user: User) {
	try {
		if (!user.email) return false
		const foundUser: any = await fetchUserByEmail(user.email)
		if (!foundUser.error) {
			if (foundUser.Estatus === 'Aprovado') {
				return true
			} else {
				return false
			}
		} else {
			await createUser({
				ID: NaN,
				Nombre: user.family_name ? user.family_name : '',
				Email: user.email,
				Accesos: '',
				Administrador: false,
				Estatus: 'Pendiente',
			})
			return false
		}
	} catch (error) {
		console.error('Error checking user authentication:', error)
		return false
	}
}

const withAuthentication = (Component: React.ComponentType) => {
	return (props: any) => {
		const { isAuthenticated, isLoading, loginWithRedirect, user } = useAuth0()
		const router = useRouter()
		const [authorizedStatus, setAuthorizedStatus] = useState<boolean>(false)

		useEffect(() => {
			if (!isLoading && !isAuthenticated) {
				loginWithRedirect({
					appState: { targetUrl: router.asPath },
				})
			}
		}, [isLoading, isAuthenticated])

		useEffect(() => {
			if (user) {
				;(async () => {
					const result = await isAuthorized(user)
					setAuthorizedStatus(result)
				})()
			}
		}, [user])

		if (isLoading || !isAuthenticated) {
			return (
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						height: '100vh',
					}}
				>
					<ScaleLoader color={'gray'} loading={isLoading} />
				</div>
			)
		}

		if (!authorizedStatus) {
			return (
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						height: '100vh',
					}}
				>
					<AlertMessage
						title="Your account is being verified"
						messages={[
							'Please wait while an administrator reviews your access.',
							'You will not be able to use any portal functionalities until approved.',
						]}
					/>
				</div>
			)
		}

		return <Component {...props} />
	}
}

export default withAuthentication
