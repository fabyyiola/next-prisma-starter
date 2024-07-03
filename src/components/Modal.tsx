import React from 'react'
import {
	Button,
	Dialog,
	DialogHeader,
	DialogBody,
	DialogFooter,
} from '@material-tailwind/react'

export type ModalSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | null

interface ModalProps {
	size: ModalSize
	isOpen: boolean
	handleOpen: () => void
	headerText?: string
	footerChildren?: React.ReactNode
	children?: React.ReactNode
}

export function Modal({
	size,
	isOpen,
	handleOpen,
	headerText = 'Default Header',
	footerChildren,
	children,
}: ModalProps) {
	return (
		<>
			<Dialog open={isOpen} size={size || 'md'} handler={handleOpen}>
				<DialogHeader>{headerText}</DialogHeader>
				<DialogBody>{children}</DialogBody>
				{footerChildren ? <DialogFooter>footerChildren</DialogFooter> : <></>}
			</Dialog>
		</>
	)
}
