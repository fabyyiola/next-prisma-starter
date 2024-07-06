import React, { useState, useEffect, useRef, useMemo } from 'react'
import {
	MagnifyingGlassIcon,
	ChevronUpDownIcon,
	ChevronUpIcon,
	ChevronDownIcon,
} from '@heroicons/react/24/outline'
import { PencilIcon, UserPlusIcon, FunnelIcon } from '@heroicons/react/24/solid'
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
} from '@material-tailwind/react'
import { colors } from '@material-tailwind/react/types/generic'
import transformObj from '@/utils/transformTableRow'

export interface Tab {
	label: string
	value: string
	columnIndex: number
}

export interface TableCell {
	type: 'text' | 'avatar' | 'chip'
	value: string
	colName: string
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
	handleAddClick?: () => void
	handleEditClick?: (row: any) => void
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
	handleAddClick = () => {},
	handleEditClick = () => {},
}: TableExtProps) {
	const [tableState, setTableState] = useState({
		searchQuery: '',
		activeTabValue: 'all',
		currentPage: 1,
		filterModalVisible: Array(tableHead.length).fill(false),
		filterInputValues: Array(tableHead.length).fill(''),
		sortConfig: null as {
			key: string
			direction: 'ascending' | 'descending'
		} | null,
		columnFilters: Array(tableHead.length).fill(''),
	})
	const filterRefs = useRef<(HTMLDivElement | null)[]>([])
	const rowsPerPage = 20

	const filteredAndSortedRows = useMemo(() => {
		let filteredRowsCopy: TableRow[] = [...initialTableRows]

		// Apply tab filter
		if (tableState.activeTabValue && tableState.activeTabValue !== 'all') {
			const selectedTab = tabs.find(
				(tab) => tab.value === tableState.activeTabValue
			)
			if (selectedTab) {
				filteredRowsCopy = filteredRowsCopy.filter((row) => {
					const cell = row.cells[selectedTab.columnIndex]
					return (
						cell &&
						cell.value.toLowerCase().includes(selectedTab.value.toLowerCase())
					)
				})
			}
		}

		// Apply search query filter
		if (tableState.searchQuery) {
			filteredRowsCopy = filteredRowsCopy.filter((row) => {
				return row.cells.some((cell) =>
					cell.value
						.toLowerCase()
						.includes(tableState.searchQuery.toLowerCase())
				)
			})
		}

		// Apply column filters
		if (tableState.columnFilters.some((filter) => filter !== '')) {
			filteredRowsCopy = filteredRowsCopy.filter((row) =>
				row.cells.every((cell, index) =>
					cell.value
						.toLowerCase()
						.includes(tableState.columnFilters[index].toLowerCase())
				)
			)
		}

		// Apply sorting
		if (tableState.sortConfig !== null) {
			filteredRowsCopy.sort((a, b) => {
				const keyIndex = tableHead.indexOf(tableState.sortConfig!.key) // Use the non-null assertion operator (!)
				const aValue = a.cells[keyIndex].value.toLowerCase()
				const bValue = b.cells[keyIndex].value.toLowerCase()

				if (aValue < bValue) {
					return tableState.sortConfig!.direction === 'ascending' ? -1 : 1
				}
				if (aValue > bValue) {
					return tableState.sortConfig!.direction === 'ascending' ? 1 : -1
				}
				return 0
			})
		}

		return filteredRowsCopy
	}, [
		initialTableRows,
		tabs,
		tableState.activeTabValue,
		tableState.searchQuery,
		tableState.columnFilters,
		tableState.sortConfig,
		tableHead,
	])

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				filterRefs.current.some(
					(ref) => ref && !ref.contains(event.target as Node)
				)
			) {
				setTableState((prevState) => ({
					...prevState,
					filterModalVisible: Array(tableHead.length).fill(false),
				}))
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [filterRefs, tableHead.length])

	const handleSearchChange = (query: string) => {
		setTableState((prevState) => ({
			...prevState,
			searchQuery: query,
			currentPage: 1,
		}))
	}

	const handleTabChange = (value: string) => {
		setTableState((prevState) => ({
			...prevState,
			activeTabValue: value,
			currentPage: 1,
		}))
	}

	const handleSort = (columnIndex: number) => {
		const key = tableHead[columnIndex]
		let direction: 'ascending' | 'descending' = 'ascending'
		if (
			tableState.sortConfig &&
			tableState.sortConfig.key === key &&
			tableState.sortConfig.direction === 'ascending'
		) {
			direction = 'descending'
		}
		setTableState((prevState) => ({
			...prevState,
			sortConfig: { key, direction },
		}))
	}

	const handleFilterChange = (value: string, index: number) => {
		const newFilters = [...tableState.columnFilters]
		newFilters[index] = value
		setTableState((prevState) => ({ ...prevState, columnFilters: newFilters }))
	}

	const handlePageChange = (newPage: number) => {
		if (
			newPage > 0 &&
			newPage <= Math.ceil(filteredAndSortedRows.length / rowsPerPage)
		) {
			setTableState((prevState) => ({ ...prevState, currentPage: newPage }))
		}
	}

	const allTab: Tab = { label: 'All', value: 'all', columnIndex: -1 }
	const paginatedRows = filteredAndSortedRows.slice(
		(tableState.currentPage - 1) * rowsPerPage,
		tableState.currentPage * rowsPerPage
	)
	const headersPadding = '2'
	const isScrollable = tableHead.length > 5

	return (
		<Card className="h-full w-full">
			<CardHeader floated={false} shadow={false} className="rounded-none mb-2">
				<div className="mb-4 flex items-baseline gap-2">
					<Typography variant="h5" color="blue-gray">
						{title}
					</Typography>
					<Typography color="gray" className="font-small">
						{subtitle}
					</Typography>
				</div>
				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
					<Tabs value={tableState.activeTabValue} className="w-full md:w-max">
						<TabsHeader>
							{[allTab, ...tabs].map(({ label, value, columnIndex }) => (
								<Tab
									onClick={() => handleTabChange(value)}
									key={value}
									value={value}
									className={
										tableState.activeTabValue === value ? 'text-blue-500' : ''
									}
								>
									&nbsp;&nbsp;{label}&nbsp;&nbsp;
								</Tab>
							))}
						</TabsHeader>
					</Tabs>
					<div className="flex">
						{showAddRecordButton && (
							<Button
								onClick={handleAddClick}
								className="flex items-center gap-3 mr-2"
								size="sm"
							>
								<UserPlusIcon strokeWidth={2} className="h-4 w-4" />{' '}
								{addRecordButtonText}
							</Button>
						)}
						{showSearchInput && (
							<div className="w-full md:w-72">
								<Input
									crossOrigin={''}
									label="Search"
									icon={<MagnifyingGlassIcon className="h-5 w-5" />}
									value={tableState.searchQuery}
									onChange={(e) => handleSearchChange(e.target.value)}
								/>
							</div>
						)}
					</div>
				</div>
			</CardHeader>
			<CardBody className={`pt-0 h-[calc(100vh-250px)] overflow-y-scroll`}>
				<table
					className={`mt-4 w-full ${
						isScrollable ? 'min-w-max' : ''
					} table-auto text-left`}
				>
					<thead className="sticky top-0 z-10 bg-white">
						<tr>
							{tableHead.map((head, index) => (
								<th
									title={tableState.filterInputValues[index]}
									key={head}
									onClick={() => handleSort(index)}
									className={
										'cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50 p-' +
										headersPadding +
										' transition-colors hover:bg-blue-gray-100 relative'
									}
									style={{ top: 0 }}
								>
									<div
										color="blue-gray"
										className="flex items-center justify-between gap-2 font-normal leading-none"
									>
										<div className="flex items-center gap-2">
											{tableState.sortConfig &&
											tableState.sortConfig.key === head ? (
												tableState.sortConfig.direction === 'ascending' ? (
													<ChevronUpIcon strokeWidth={2} className="h-4 w-4" />
												) : (
													<ChevronDownIcon
														strokeWidth={2}
														className="h-4 w-4"
													/>
												)
											) : (
												<ChevronUpDownIcon
													strokeWidth={2}
													className="h-4 w-4"
												/>
											)}
											{head}
										</div>
										<button
											className="ml-2"
											onClick={(event) => {
												event.stopPropagation() // Prevent event propagation
												const newFilterModalVisible = Array(
													tableState.filterModalVisible.length
												).fill(false)
												newFilterModalVisible[index] =
													!tableState.filterModalVisible[index]
												setTableState((prevState) => ({
													...prevState,
													filterModalVisible: newFilterModalVisible,
												}))
											}}
										>
											<FunnelIcon
												strokeWidth={2}
												className={`h-4 w-4 ${
													tableState.filterInputValues[index]
														? 'text-blue-500'
														: ''
												}`}
											/>
										</button>
										{tableState.filterModalVisible[index] && (
											<div
												className="absolute top-full mt-1 left-0 bg-white p-2 shadow-lg border border-gray-300 z-10"
												ref={(el) => (filterRefs.current[index] = el)}
											>
												<input
													value={tableState.filterInputValues[index]}
													onChange={(
														e: React.ChangeEvent<HTMLInputElement>
													) => {
														const newFilterInputValues = [
															...tableState.filterInputValues,
														]
														newFilterInputValues[index] = e.target.value
														setTableState((prevState) => ({
															...prevState,
															filterInputValues: newFilterInputValues,
														}))
														handleFilterChange(e.target.value, index)
													}}
													placeholder={`Buscar ${head}`}
													onClick={(
														event: React.MouseEvent<HTMLInputElement>
													) => event.stopPropagation()} // Prevent event propagation
												/>
											</div>
										)}
									</div>
								</th>
							))}
							{showEditButton && (
								<th
									className={
										'cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50 p-' +
										headersPadding +
										' transition-colors hover:bg-blue-gray-100'
									}
									style={{ top: 0 }}
								>
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
						{paginatedRows.map((row, rowIndex) => {
							const isLast = rowIndex === paginatedRows.length - 1
							const classes = isLast
								? 'p-0'
								: 'p-0 border-b border-blue-gray-50'

							return (
								<tr
									key={rowIndex}
									className={`hover:bg-gray-200 even:bg-gray-50`}
								>
									{row.cells.map((cell, cellIndex) => (
										<td
											key={cellIndex}
											className={classes + (cellIndex === 0 ? ' pl-4' : '')}
										>
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
											<IconButton
												variant="text"
												onClick={() => handleEditClick(transformObj(row))}
											>
												<PencilIcon className="h-4 w-4" />
											</IconButton>
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
					Page {tableState.currentPage} of{' '}
					{Math.ceil(filteredAndSortedRows.length / rowsPerPage)}
				</Typography>
				<div className="flex gap-2">
					<Button
						variant="outlined"
						size="sm"
						onClick={() => handlePageChange(tableState.currentPage - 1)}
						disabled={tableState.currentPage === 1}
					>
						Previous
					</Button>
					<Button
						variant="outlined"
						size="sm"
						onClick={() => handlePageChange(tableState.currentPage + 1)}
						disabled={
							tableState.currentPage ===
							Math.ceil(filteredAndSortedRows.length / rowsPerPage)
						}
					>
						Next
					</Button>
				</div>
			</CardFooter>
		</Card>
	)
}
