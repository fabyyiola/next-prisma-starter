import React, { useState, useEffect } from 'react'
import {
	MagnifyingGlassIcon,
	ChevronUpDownIcon,
} from '@heroicons/react/24/outline'
import { PencilIcon, UserPlusIcon } from '@heroicons/react/24/solid'
import {
	Card,
	CardHeader,
	Input,
	Typography,
	Button,
	CardBody,
	Chip,
	CardFooter,
	Tabs,
	TabsHeader,
	Tab,
	Avatar,
	IconButton,
	Tooltip,
} from '@material-tailwind/react'
import { colors } from '@material-tailwind/react/types/generic'

export interface Tab {
	label: string
	value: string
	columnIndex: number
}

export interface TableCell {
	type: 'text' | 'avatar' | 'chip'
	value: string
	subtitle?: string
	imgSrc?: string
	chipColor?: colors | undefined
}

export interface TableRow {
	cells: TableCell[]
}

interface TableExtProps {
	tabs?: Tab[]
	tableHead?: string[]
	tableRows?: TableRow[]
	title?: string
	subtitle?: string
	showEditButton?: boolean
	showAddRecordButton?: boolean
	showSearchInput?: boolean
	addRecordButtonText?: string
	handleOpen?: () => void
  handleEditClick?: (row:any) => void
}

export default function TableExt({
	tabs = [],
	tableHead = [],
	tableRows: initialTableRows = [],
	title = 'Default Title',
	subtitle = 'Default Subtitle',
	showEditButton = false,
	showAddRecordButton = false,
	showSearchInput = false,
	addRecordButtonText = 'Agregar registro',
	handleOpen = () => {},
  handleEditClick= ()=>{}
}: TableExtProps) {
	const [searchQuery, setSearchQuery] = useState<string>('')
	const [filteredRows, setFilteredRows] = useState<TableRow[]>(initialTableRows)

	// Update filtered rows whenever initialTableRows or tabs change
	useEffect(() => {
		filterRows()
	}, [initialTableRows, tabs])

	const handleSearch = (
		query: string,
		columnIndex?: number,
		changeInputVal: boolean = true
	) => {
		if (changeInputVal) setSearchQuery(query)
		filterRows(query, columnIndex)
	}

	const filterRows = (query?: string, columnIndex?: number) => {
		let filteredRowsCopy = [...initialTableRows]
		if (query == 'all') {
			setFilteredRows(filteredRowsCopy)
		} else {
			if (query && columnIndex !== undefined) {
				// Filter by both query and specified columnIndex
				filteredRowsCopy = initialTableRows.filter((row) => {
					const cell = row.cells[columnIndex]
					return cell && cell.value.toLowerCase().includes(query.toLowerCase())
				})
			} else if (query) {
				// Filter by query across all columns
				filteredRowsCopy = initialTableRows.filter((row) => {
					return row.cells.some((cell) =>
						cell.value.toLowerCase().includes(query.toLowerCase())
					)
				})
			} else {
				// If only columnIndex is provided, show all rows (as query is not specified)
				// This case doesn't really make sense based on the requirements, so it defaults to showing all records
				filteredRowsCopy = [...initialTableRows]
			}

			setFilteredRows(filteredRowsCopy)
		}
	}

	const [activeTabValue, setActiveTabValue] = useState<string>('all')

	const handleTabChange = (value: string) => {
		setActiveTabValue(value)
		if (value === 'all') {
			setFilteredRows(initialTableRows)
		} else {
			const selectedTab = tabs.find((tab) => tab.value === value)
			if (selectedTab) {
				const { columnIndex, value } = selectedTab
				filterRows(value, columnIndex)
			}
		}
	}

	useEffect(() => {
		handleTabChange('all')
	}, [])

	const allTab: Tab = { label: 'All', value: 'all', columnIndex: -1 }
	return (
		<Card className="h-full w-full">
			<CardHeader floated={false} shadow={false} className="rounded-none">
				<div className="mb-8 flex items-center justify-between gap-8">
					<div>
						<Typography variant="h5" color="blue-gray">
							{title}
						</Typography>
						<Typography color="gray" className="mt-1 font-normal">
							{subtitle}
						</Typography>
					</div>
					{showAddRecordButton && (
						<div className="flex shrink-0 flex-col gap-2 sm:flex-row">
							<Button
								onClick={handleOpen}
								className="flex items-center gap-3"
								size="sm"
							>
								<UserPlusIcon strokeWidth={2} className="h-4 w-4" />{' '}
								{addRecordButtonText}
							</Button>
						</div>
					)}
				</div>
				<div className="flex flex-col items-center justify-between gap-4 md:flex-row">
					<Tabs
						value={activeTabValue}
						className="w-full md:w-max"
						onChange={handleTabChange}
					>
						<TabsHeader>
							{[allTab, ...tabs].map(({ label, value, columnIndex }) => (
								<Tab
									onClick={() => {
										handleSearch(value, columnIndex,false)
									}}
									key={value}
									value={value}
								>
									&nbsp;&nbsp;{label}&nbsp;&nbsp;
								</Tab>
							))}
						</TabsHeader>
					</Tabs>
					{showSearchInput && (
						<div className="w-full md:w-72">
							<Input
								crossOrigin={''}
								label="Search"
								icon={<MagnifyingGlassIcon className="h-5 w-5" />}
								value={searchQuery}
								onChange={(e) => handleSearch(e.target.value)}
							/>
						</div>
					)}
				</div>
			</CardHeader>
			<CardBody className="overflow-scroll px-0">
				<table className="mt-4 w-full min-w-max table-auto text-left">
					<thead>
						<tr>
							{tableHead.map((head, index) => (
								<th
									key={head}
									className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
								>
									<Typography
										variant="small"
										color="blue-gray"
										className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
									>
										{head}{' '}
										{index !== tableHead.length - 1 && (
											<ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
										)}
									</Typography>
								</th>
							))}
							{showEditButton && (
								<th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
									<Typography
										variant="small"
										color="blue-gray"
										className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
									>
										Actions
									</Typography>
								</th>
							)}
						</tr>
					</thead>
					<tbody>
						{filteredRows.map((row, rowIndex) => {
							const isLast = rowIndex === filteredRows.length - 1
							const classes = isLast
								? 'p-4'
								: 'p-4 border-b border-blue-gray-50'

							return (
								<tr key={rowIndex}>
									{row.cells.map((cell, cellIndex) => (
										<td key={cellIndex} className={classes}>
											{cell.type === 'text' && (
												<Typography
													variant="small"
													color="blue-gray"
													className="font-normal"
												>
													{cell.value}
												</Typography>
											)}
											{cell.type === 'avatar' && (
												<div className="flex items-center gap-3">
													<Avatar
														src={cell.imgSrc}
														alt={cell.value}
														size="sm"
													/>
													<div className="flex flex-col">
														<Typography
															variant="small"
															color="blue-gray"
															className="font-normal"
														>
															{cell.value}
														</Typography>
														{cell.subtitle && (
															<Typography
																variant="small"
																color="blue-gray"
																className="font-normal opacity-70"
															>
																{cell.subtitle}
															</Typography>
														)}
													</div>
												</div>
											)}
											{cell.type === 'chip' && (
												<div className="w-max">
													<Chip
														variant="ghost"
														size="sm"
														value={cell.value}
														color={cell.chipColor || 'blue-gray'}
													/>
												</div>
											)}
										</td>
									))}
									{showEditButton && (
										<td className={classes}>
											<Tooltip content="Edit User">
												<IconButton variant="text" onClick={()=>handleEditClick(row)}>
													<PencilIcon className="h-4 w-4" />
												</IconButton>
											</Tooltip>
										</td>
									)}
								</tr>
							)
						})}
					</tbody>
				</table>
			</CardBody>
			<CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
				<Typography variant="small" color="blue-gray" className="font-normal">
					Page 1 of 10
				</Typography>
				<div className="flex gap-2">
					<Button variant="outlined" size="sm">
						Previous
					</Button>
					<Button variant="outlined" size="sm">
						Next
					</Button>
				</div>
			</CardFooter>
		</Card>
	)
}
