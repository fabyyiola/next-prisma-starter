import React from 'react'
import {
	IconButton,
	Typography,
	List,
	ListItem,
	ListItemPrefix,
	Alert,
	Input,
	Drawer,
	Card,
} from '@material-tailwind/react'
import DynamicHeroIcon from './DynamicHeroIcon'
import {
	CubeTransparentIcon,
	MagnifyingGlassIcon,
	Bars3Icon,
	XMarkIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import menuData from '@/data/menu'

export default function SidebarWithBurgerMenu() {
	const [open, setOpen] = React.useState(0)
	const [openAlert, setOpenAlert] = React.useState(false) //set to true to show alert
	const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)

	const handleOpen = (value: any) => {
		setOpen(open === value ? 0 : value)
	}

	const openDrawer = () => setIsDrawerOpen(true)
	const closeDrawer = () => setIsDrawerOpen(false)

	return (
		<>
			<IconButton
				className="btnSidebar"
				variant="text"
				size="lg"
				onClick={openDrawer}
			>
				{isDrawerOpen ? (
					<XMarkIcon className="h-8 w-8 stroke-2" />
				) : (
					<Bars3Icon className="h-8 w-8 stroke-2" />
				)}
			</IconButton>
			<Drawer open={isDrawerOpen} onClose={closeDrawer}>
				<Card
					color="transparent"
					shadow={false}
					className="h-[calc(100vh-2rem)] w-full p-4"
				>
					<div className="mb-2 flex items-center gap-4 p-4">
						<img
							src="https://docs.material-tailwind.com/img/logo-ct-dark.png"
							alt="brand"
							className="h-8 w-8"
						/>
						<Typography variant="h5" color="blue-gray">
							Sidebar
						</Typography>
					</div>
					<div className="p-2">
						<Input
							crossOrigin={""}
							icon={<MagnifyingGlassIcon className="h-5 w-5" />}
							label="Search"
						/>
					</div>
					<List>
						{menuData.map((item, index) => (
							<ListItem key={index}>
								<ListItemPrefix>
									<DynamicHeroIcon icon={item.icon} />
								</ListItemPrefix>
								<Link href={item.href}>{item.title}</Link>
							</ListItem>
						))}
					</List>
					<Alert
						open={openAlert}
						className="mt-auto"
						onClose={() => setOpenAlert(false)}
					>
						<CubeTransparentIcon className="mb-4 h-12 w-12" />
						<Typography variant="h6" className="mb-1">
							Upgrade to PRO
						</Typography>
						<Typography variant="small" className="font-normal opacity-80">
							Upgrade to Material Tailwind PRO and get even more components,
							plugins, advanced features and premium.
						</Typography>
						<div className="mt-4 flex gap-3">
							<Typography
								as="a"
								href="#"
								variant="small"
								className="font-medium opacity-80"
								onClick={() => setOpenAlert(false)}
							>
								Dismiss
							</Typography>
							<Typography
								as="a"
								href="#"
								variant="small"
								className="font-medium"
							>
								Upgrade Now
							</Typography>
						</div>
					</Alert>
				</Card>
			</Drawer>
		</>
	)
}
