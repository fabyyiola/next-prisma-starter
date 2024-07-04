import React, { ReactNode } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import LayoutHeader from './LayoutHeader'

interface LayoutProps {
	children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
	return (
		<div className="layout">
      <LayoutHeader/>
			<div className="content">
				<Sidebar />
				<main className="main-content">{children}</main>
			</div>
		</div>
	)
}
