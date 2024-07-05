import React, { useState, useEffect } from 'react'
import {
	MagnifyingGlassIcon,
	ChevronUpDownIcon,
	PencilIcon,
	UserPlusIcon,
	FunnelIcon,
} from '@heroicons/react/24/outline'
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
	Select,
	Option as SelectOption,
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
	onSort?: (sortedRows: TableRow[]) => void
}

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

export default function TableCards({
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
	onSort = () => {},
}: TableExtProps) {
	const [searchQuery, setSearchQuery] = useState<string>('')
	const [filteredRows, setFilteredRows] = useState<TableRow[]>(initialTableRows)
	const [activeTabValue, setActiveTabValue] = useState<string>('all')
	const [mobilSortOrientationSelected, setMobilSortOrientationSelected] =
		useState<string>('')
	const [mobilSortedColumn, setMobilSortedColumn] = useState<number>(NaN)
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
		if (sortConfig) {
			const sortedRows = sortRows(sortConfig)
			setFilteredRows(sortedRows)
			if (onSort) {
				onSort(sortedRows)
			}
		}
	}, [sortConfig])

	const handleSearch = (
		query: string,
		columnIndex?: number,
		changeInputVal: boolean = true
	) => {
		if (changeInputVal) setSearchQuery(query)
		filterRows(query, columnIndex)
		setCurrentPage(1) // Reset to first page on new search
	}

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
				filteredRowsCopy = initialTableRows.filter((row) => {
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

	const handlePageChange = (newPage: number) => {
		if (newPage > 0 && newPage <= totalPages) {
			setCurrentPage(newPage)
		}
	}

	const handleSort = (
		columnIndex: number,
		direction: 'ascending' | 'descending'
	) => {
		setMobilSortOrientationSelected(direction)
		setMobilSortedColumn(columnIndex)
		const key = tableHead[columnIndex]
		setSortConfig({ key, direction })
	}

	const sortRows = (config: {
		key: string
		direction: 'ascending' | 'descending'
	}) => {
		const sortedRows = [...filteredRows].sort((a, b) => {
			const aValue = a.cells[tableHead.indexOf(config.key)].value.toLowerCase()
			const bValue = b.cells[tableHead.indexOf(config.key)].value.toLowerCase()

			if (aValue < bValue) {
				return config.direction === 'ascending' ? -1 : 1
			}
			if (aValue > bValue) {
				return config.direction === 'ascending' ? 1 : -1
			}
			return 0
		})
		return sortedRows
	}

	const toggleFilters = () => {
		setShowFilters(!showFilters)
	}

	const allTab: Tab = { label: 'All', value: 'all', columnIndex: -1 }
	const paginatedRows = filteredRows.slice(
		(currentPage - 1) * rowsPerPage,
		currentPage * rowsPerPage
	)
	const startRecord = (currentPage - 1) * rowsPerPage + 1
	const endRecord = startRecord + paginatedRows.length - 1
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
					<div className="flex items-center gap-2">
						<Select
							label="Sort by"
							value={activeTabValue}
							onChange={(e: any) => {
								handleSort(parseInt(e), 'ascending')
							}}
							className="w-full md:w-72"
						>
							{tableHead.map((head, index) => (
								<SelectOption key={index} value={index.toString()}>
									{head}
								</SelectOption>
							))}
						</Select>
						<Button
							disabled={mobilSortOrientationSelected === ''}
							onClick={() => {
								handleSort(
									mobilSortedColumn,
									mobilSortOrientationSelected === 'ascending'
										? 'descending'
										: 'ascending'
								)
							}}
							className="flex items-center gap-2"
							variant="outlined"
							size="sm"
						>
							{mobilSortOrientationSelected === 'ascending' ? 'desc' : 'asc'}
						</Button>
					</div>
				</div>
			</CardHeader>
			<CardBody className="pt-0 h-96 overflow-y-scroll">
				<div className="grid grid-cols-1 gap-4">
					{paginatedRows.map((row, rowIndex) => (
						<Card key={rowIndex} className="shadow-md p-4 bg-gray-100">
							<div className="flex flex-col">
								{row.cells.map((cell, cellIndex) => (
									<div
										key={cellIndex}
										style={{ display: cell.colName === 'ID' ? 'none' : '' }}
									>
										{cell.type === 'avatar' && (
											<Avatar src={cell.imgSrc} alt={cell.value} size="sm" />
										)}
										{cell.type === 'chip' && (
											<Chip
												variant="ghost"
												size="sm"
												value={cell.value}
												color={cell.chipColor || 'blue-gray'}
											/>
										)}
										{cell.type != 'chip' && (
											<Typography
												style={{ fontWeight: cellIndex === 1 ? 700 : 0 }}
												color="blue-gray"
											>
												{cell.value}
											</Typography>
										)}

										{cell.subtitle && (
											<Typography color="gray" className="text-sm">
												{cell.subtitle}
											</Typography>
										)}
									</div>
								))}
								{showEditButton && (
									<div className="flex justify-end absolute right-0 top-0">
										<IconButton
											variant="text"
											onClick={() => handleEditClick(transformObj(row))}
										>
											<PencilIcon className="h-4 w-4" />
										</IconButton>
									</div>
								)}
							</div>
						</Card>
					))}
				</div>
			</CardBody>
			<CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
				<Typography variant="small" color="blue-gray" className="font-normal">
					Pagina {currentPage} de {totalPages}
				</Typography>
				<div className="flex gap-2">
					<Button
						variant="outlined"
						size="sm"
						onClick={() => handlePageChange(currentPage - 1)}
						disabled={currentPage === 1}
					>
						Anterior
					</Button>
					<Button
						variant="outlined"
						size="sm"
						onClick={() => handlePageChange(currentPage + 1)}
						disabled={currentPage === totalPages}
					>
						Siguiente
					</Button>
				</div>
				<Typography variant="small" color="blue-gray" className="font-normal fixed mt-20">
					Mostrando registros {startRecord}-{endRecord} de {filteredRows.length}{' '}
					en total
				</Typography>
			</CardFooter>
		</Card>
	)
}
