import React, { useState, useEffect, useRef } from 'react'
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
	IconButton
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
	handleEditClick = () => {}
}: TableExtProps) {
	const [searchQuery, setSearchQuery] = useState<string>('')
	const [filteredRows, setFilteredRows] = useState<TableRow[]>(initialTableRows)
	const [activeTabValue, setActiveTabValue] = useState<string>('all')
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [filterModalVisible, setFilterModalVisible] = useState<boolean[]>(
		Array(tableHead.length).fill(false)
	)
	const [filterInputValues, setFilterInputValues] = useState<string[]>(
		Array(tableHead.length).fill('')
	)
	const filterRefs = useRef<(HTMLDivElement | null)[]>([])
	const rowsPerPage = 20
	const totalPages = Math.ceil(filteredRows.length / rowsPerPage)
	const [sortConfig, setSortConfig] = useState<{
		key: string
		direction: 'ascending' | 'descending'
	} | null>(null)
	const [columnFilters, setColumnFilters] = useState<string[]>(
		Array(tableHead.length).fill('')
	)
	
	useEffect(() => {
		let filteredRowsCopy: TableRow[] = [...initialTableRows];
	
		// Apply tab filter
		if (activeTabValue && activeTabValue !== 'all') {
			const selectedTab = tabs.find((tab) => tab.value === activeTabValue);
			if (selectedTab) {
				filteredRowsCopy = filteredRowsCopy.filter((row) => {
					const cell = row.cells[selectedTab.columnIndex];
					return cell && cell.value.toLowerCase().includes(selectedTab.value.toLowerCase());
				});
			}
		}
	
		// Apply search query filter
		if (searchQuery) {
			filteredRowsCopy = filteredRowsCopy.filter((row) => {
				return row.cells.some((cell) => cell.value.toLowerCase().includes(searchQuery.toLowerCase()));
			});
		}
	
		// Apply column filters
		if (columnFilters.some((filter) => filter !== '')) {
			filteredRowsCopy = filteredRowsCopy.filter((row) =>
				row.cells.every((cell, index) =>
					cell.value.toLowerCase().includes(columnFilters[index].toLowerCase())
				)
			);
		}
	
		// Apply sorting
		if (sortConfig !== null) {
			filteredRowsCopy.sort((a, b) => {
				const aValue = a.cells[tableHead.indexOf(sortConfig.key)].value.toLowerCase();
				const bValue = b.cells[tableHead.indexOf(sortConfig.key)].value.toLowerCase();
	
				if (aValue < bValue) {
					return sortConfig.direction === 'ascending' ? -1 : 1;
				}
				if (aValue > bValue) {
					return sortConfig.direction === 'ascending' ? 1 : -1;
				}
				return 0;
			});
		}
	
		setFilteredRows(filteredRowsCopy);
	}, [initialTableRows, tabs, columnFilters, searchQuery, sortConfig, activeTabValue, tableHead]);
	
	
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				filterRefs.current.some(
					(ref) => ref && !ref.contains(event.target as Node)
				)
			) {
				setFilterModalVisible(Array(tableHead.length).fill(false))
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [filterRefs])
	/**
	 * Handles the search input change and filters rows.
	 */
	const handleSearch = (
		query: string,
		columnIndex?: number,
		changeInputVal: boolean = true
	) => {
		if (changeInputVal) setSearchQuery(query)
		setCurrentPage(1) // Reset to first page on new search
	}

	/**
	 * Filters the table rows based on the search query and column filters.
	 */
	const filterRows = (
		query?: string,
		columnIndex?: number,
		selTabVal?: string
	) => {
		let filteredRowsCopy = [...initialTableRows]
		console.log('params:', query, columnIndex, selTabVal, activeTabValue)
		console.log('before tab filter:', filteredRowsCopy)
		if (!selTabVal && activeTabValue != 'all') selTabVal = activeTabValue //Apply tab filter
		// Apply tab filter first
		if (selTabVal) {
			const selectedTab = tabs.find((tab) => tab.value === selTabVal)
			console.log('selectedTab:', selectedTab)
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

		// Debug: Log after applying tab filter
		console.log('After tab filter:', filteredRowsCopy)

		// Apply search query filter
		if (query && columnIndex !== undefined) {
			filteredRowsCopy = filteredRowsCopy.filter((row) => {
				const cell = row.cells[columnIndex]
				return cell && cell.value.toLowerCase().includes(query.toLowerCase())
			})
		} else if (query && query !== '') {
			filteredRowsCopy = filteredRowsCopy.filter((row) => {
				return row.cells.some((cell) =>
					cell.value.toLowerCase().includes(query.toLowerCase())
				)
			})
		} else if (query === '' && activeTabValue !== 'all') {
			const selectedTab = tabs.find((tab) => tab.value === activeTabValue)
			if (selectedTab) {
				filteredRowsCopy = filteredRowsCopy.filter((row) => {
					const cell = row.cells[selectedTab.columnIndex]
					return (
						cell &&
						cell.value.toLowerCase().includes(activeTabValue.toLowerCase())
					)
				})
			}
		}

		// Debug: Log after applying search query filter
		console.log('After search query filter:', filteredRowsCopy)

		// Apply column filters
		if (columnFilters.some((filter) => filter !== '')) {
			filteredRowsCopy = filteredRowsCopy.filter((row) =>
				row.cells.every((cell, index) =>
					cell.value.toLowerCase().includes(columnFilters[index].toLowerCase())
				)
			)
		}

		// Debug: Log after applying column filters
		console.log('After column filters:', filteredRowsCopy)

		setFilteredRows(filteredRowsCopy)
	}

	/**
	 * Handles the tab change and filters rows.
	 */
	const handleTabChange = (value: string, colIndex: number) => {
		setSearchQuery('')
		setActiveTabValue(value)
		if (value === 'all') {
			setFilteredRows(initialTableRows)
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
	 * Handles the column filter change and filters rows.
	 */
	const handleFilterChange = (value: string, index: number) => {
		const newFilters = [...columnFilters]
		newFilters[index] = value
		setColumnFilters(newFilters)
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
									value={searchQuery}
									onChange={(e) => handleSearch(e.target.value)}
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
									title={filterInputValues[index]}
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
											<ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
											{head}
										</div>
										<button
											className="ml-2"
											onClick={(event) => {
												event.stopPropagation() // Evita la propagación del evento
												const newFilterModalVisible = Array(
													filterModalVisible.length
												).fill(false)
												newFilterModalVisible[index] =
													!filterModalVisible[index]
												setFilterModalVisible(newFilterModalVisible)
											}}
										>
											<FunnelIcon
												strokeWidth={2}
												className={`h-4 w-4 ${
													filterInputValues[index] ? 'text-blue-500' : ''
												}`}
											/>
										</button>
										{filterModalVisible[index] && (
											<div
												className="absolute top-full mt-1 left-0 bg-white p-2 shadow-lg border border-gray-300 z-10"
												ref={(el) => (filterRefs.current[index] = el)}
											>
												<input
													value={filterInputValues[index]}
													onChange={(
														e: React.ChangeEvent<HTMLInputElement>
													) => {
														const newFilterInputValues = [...filterInputValues]
														newFilterInputValues[index] = e.target.value
														setFilterInputValues(newFilterInputValues)
														handleFilterChange(e.target.value, index)
													}}
													placeholder={`Buscar ${head}`}
													onClick={(
														event: React.MouseEvent<HTMLInputElement>
													) => event.stopPropagation()} // Detiene la propagación del evento
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
