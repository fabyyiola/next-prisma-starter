import React from 'react'
import { Alert } from '@material-tailwind/react'
import colors from '@/styles/color'

interface NotificationAlertProps {
	message: string
	type?: 'info' | 'warning' | 'error' | 'success'
	open: boolean
	setOpen: (open: boolean) => void
}

export function NotificationAlert({
	message,
	type = 'success',
	open,
	setOpen,
}: NotificationAlertProps) {
	const getAlertColor = () => {
		switch (type) {
			case 'info':
				return colors.info
			case 'warning':
				return colors.warning
			case 'error':
				return colors.danger
			default:
				return colors.success
		}
	}

	React.useEffect(() => {
		if (open) {
			const timer = setTimeout(() => setOpen(false), 10000)
			return () => clearTimeout(timer)
		}
	}, [open, setOpen])

	return (
		<Alert
			open={open}
			onClose={() => setOpen(false)}
			animate={{
				mount: { y: 0 },
				unmount: { y: 100 },
			}}
			className={`w-50 fixed top-4 right-4 text-white px-4 py-2 rounded-md shadow-md`}
			style={{ backgroundColor: getAlertColor() }}
		>
			{message}
		</Alert>
	)
}
