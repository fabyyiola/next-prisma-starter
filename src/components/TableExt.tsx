import React, { useState, useEffect } from 'react'
import {
	MagnifyingGlassIcon,
	ChevronUpDownIcon,
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
	Tooltip,
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

/**
 * Returns an object with the maximum length of each column value.
 */
const getMaxColumnLengths = (rows: TableRow[]): { [key: string]: number } => {
	const maxLengths: { [key: string]: number } = {}

	rows.forEach((row) => {
		row.cells.forEach((cell) => {
			const { colName, value } = cell

			if (!maxLengths[colName] || value.length > maxLengths[colName]) {
				maxLengths[colName] = value.length
			}
		})
	})

	return maxLengths
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
	const [searchQuery, setSearchQuery] = useState<string>('')
	const [filteredRows, setFilteredRows] = useState<TableRow[]>(initialTableRows)
	const [activeTabValue, setActiveTabValue] = useState<string>('all')
	const [activeTabColIndex, setActiveTabColIndex] = useState<number>(NaN)
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [showFilters, setShowFilters] = useState<boolean>(false)
	const rowsPerPage = 20
	const totalPages = Math.ceil(filteredRows.length / rowsPerPage)
	const [sortConfig, setSortConfig] = useState<{
		key: string
		direction: 'ascending' | 'descending'
	} | null>(null)
	const [columnFilters, setColumnFilters] = useState<string[]>(
		Array(tableHead.length).fill('')
	)

	const maxColumnLengths = getMaxColumnLengths(initialTableRows)

	useEffect(() => {
		filterRows()
	}, [initialTableRows, tabs, columnFilters])

	useEffect(() => {
		sortRows()
	}, [sortConfig, filteredRows])

	/**
	 * Handles the search input change and filters rows.
	 */
	const handleSearch = (
		query: string,
		columnIndex?: number,
		changeInputVal: boolean = true
	) => {
		if (changeInputVal) setSearchQuery(query)
		filterRows(query, columnIndex)
		setCurrentPage(1) // Reset to first page on new search
	}

	/**
	 * Filters the table rows based on the search query and column filters.
	 */
	const filterRows = (query?: string, columnIndex?: number) => {
		let filteredRowsCopy = [...initialTableRows]
		if (query === 'all') {
			setFilteredRows(filteredRowsCopy)
		} else {
			if (query && columnIndex !== undefined) {
				filteredRowsCopy = initialTableRows.filter((row) => {
					const cell = row.cells[columnIndex]
					return cell && cell.value.toLowerCase().includes(query.toLowerCase())
				})
			} else if (query && query !== '') {
				filteredRowsCopy = filteredRows.filter((row) => {
					return row.cells.some((cell) =>
						cell.value.toLowerCase().includes(query.toLowerCase())
					)
				})
			} else if (query === '' && activeTabValue !== 'all') {
				filteredRowsCopy = initialTableRows.filter((row) => {
					const cell = row.cells[activeTabColIndex]
					return (
						cell &&
						cell.value.toLowerCase().includes(activeTabValue.toLowerCase())
					)
				})
			}
			setFilteredRows(filteredRowsCopy)
		}
		if (columnFilters.some((filter) => filter !== '')) {
			filteredRowsCopy = filteredRowsCopy.filter((row) =>
				row.cells.every((cell, index) =>
					cell.value.toLowerCase().includes(columnFilters[index].toLowerCase())
				)
			)
		}
		setFilteredRows(filteredRowsCopy)
	}

	/**
	 * Handles the tab change and filters rows.
	 */
	const handleTabChange = (value: string, colIndex: number) => {
		setSearchQuery('')
		setActiveTabValue(value)
		setActiveTabColIndex(colIndex)
		if (value === 'all') {
			setFilteredRows(initialTableRows)
		} else {
			const selectedTab = tabs.find((tab) => tab.value === value)
			if (selectedTab) {
				const { columnIndex, value } = selectedTab
				filterRows(value, columnIndex)
			}
		}
		setCurrentPage(1) // Reset to first page on tab change
	}

	/**
	 * Handles the pagination and changes the current page.
	 */
	const handlePageChange = (newPage: number) => {
		if (newPage > 0 && newPage <= totalPages) {
			setCurrentPage(newPage)
		}
	}

	/**
	 * Handles sorting of columns.
	 */
	const handleSort = (columnIndex: number) => {
		let key = tableHead[columnIndex]
		let direction: 'ascending' | 'descending' = 'ascending'
		if (
			sortConfig &&
			sortConfig.key === key &&
			sortConfig.direction === 'ascending'
		) {
			direction = 'descending'
		}
		setSortConfig({ key, direction })
	}

	/**
	 * Sorts the rows based on the sort configuration.
	 */
	const sortRows = () => {
		if (sortConfig !== null) {
			const sortedRows = [...filteredRows].sort((a, b) => {
				let aValue =
					a.cells[tableHead.indexOf(sortConfig.key)].value.toLowerCase()
				let bValue =
					b.cells[tableHead.indexOf(sortConfig.key)].value.toLowerCase()

				if (aValue < bValue) {
					return sortConfig.direction === 'ascending' ? -1 : 1
				}
				if (aValue > bValue) {
					return sortConfig.direction === 'ascending' ? 1 : -1
				}
				return 0
			})
			setFilteredRows(sortedRows)
		}
	}

	/**
	 * Handles the column filter change and filters rows.
	 */
	const handleFilterChange = (value: string, index: number) => {
		const newFilters = [...columnFilters]
		newFilters[index] = value
		setColumnFilters(newFilters)
		filterRows()
	}

	/**
	 * Toggles the visibility of column filters.
	 */
	const toggleFilters = () => {
		setShowFilters(!showFilters)
	}

	const allTab: Tab = { label: 'All', value: 'all', columnIndex: -1 }
	const paginatedRows = filteredRows.slice(
		(currentPage - 1) * rowsPerPage,
		currentPage * rowsPerPage
	)
	const headersPadding = '2'

	const isScrollable = tableHead.length > 5 // 8 columns + 1 actions column

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
					<Tabs value={activeTabValue} className="w-full md:w-max">
						<TabsHeader>
							{[allTab, ...tabs].map(({ label, value, columnIndex }) => (
								<Tab
									onClick={() => {
										handleTabChange(value, columnIndex)
									}}
									key={value}
									value={value}
								>
									&nbsp;&nbsp;{label}&nbsp;&nbsp;
								</Tab>
							))}
						</TabsHeader>
					</Tabs>
					{showAddRecordButton && (
						<div className="flex shrink-0 flex-col gap-2 sm:flex-row">
							<Button
								onClick={toggleFilters}
								className="flex items-center gap-3"
								variant="outlined"
								size="sm"
							>
								<FunnelIcon strokeWidth={2} className="h-4 w-4" />{' '}
								{showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
							</Button>
							<Button
								onClick={handleAddClick}
								className="flex items-center gap-3"
								size="sm"
							>
								<UserPlusIcon strokeWidth={2} className="h-4 w-4" />{' '}
								{addRecordButtonText}
							</Button>
						</div>
					)}
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
			<CardBody className={`pt-0 h-96 overflow-y-scroll`}>
				<table
					className={`mt-4 w-full ${
						isScrollable ? 'min-w-max' : ''
					} table-auto text-left`}
				>
					<thead className="sticky top-0 z-10 bg-white">
						<tr>
							{tableHead.map((head, index) => (
								<th
									key={head}
									onClick={() => handleSort(index)}
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
										{head}{' '}
										<ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
									</Typography>
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
						{showFilters && (
							<tr>
								{tableHead.map((head, index) => (
									<td key={index} className="p-0">
										<input
											value={columnFilters[index]}
											onChange={(e) =>
												handleFilterChange(e.target.value, index)
											}
											className="p-0 pl-1 "
											style={{
												maxWidth: `${
													index === 0 && tableHead[0] === 'ID'
														? '60'
														: maxColumnLengths[head] * 7
												}px`,
												borderBottom: '1px solid #d2d2d2',
												marginRight: '5px',
												marginLeft:
													index === 0 && tableHead[0] === 'ID' ? '5px' : '',
											}}
										/>
									</td>
								))}
								{showEditButton && (
									<td className="p-2">{/* Empty cell for actions column */}</td>
								)}
							</tr>
						)}
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
					Page {currentPage} of {totalPages}
				</Typography>
				<div className="flex gap-2">
					<Button
						variant="outlined"
						size="sm"
						onClick={() => handlePageChange(currentPage - 1)}
						disabled={currentPage === 1}
					>
						Previous
					</Button>
					<Button
						variant="outlined"
						size="sm"
						onClick={() => handlePageChange(currentPage + 1)}
						disabled={currentPage === totalPages}
					>
						Next
					</Button>
				</div>
			</CardFooter>
		</Card>
	)
}
