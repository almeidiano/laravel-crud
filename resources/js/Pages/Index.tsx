import * as React from "react"
import {useEffect, useState} from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table"
import {ArrowUpDown, Loader2, MoreHorizontal} from "lucide-react"

import {Button} from "@/Components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu"
import {Input} from "@/Components/ui/input"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/Components/ui/table"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/Components/ui/alert-dialog"

import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,} from "@/Components/ui/dialog"

import {Label} from "@/Components/ui/label"
import {Dropzone, FileMosaic, ImagePreview} from "@files-ui/react";
import {Textarea} from "@/Components/ui/textarea"
import {router, useForm} from "@inertiajs/react";

const ProductForm = () => {
    const [extFiles, setExtFiles] = React.useState([]);
    const [imageSrc, setImageSrc] = React.useState(undefined);

    const updateFiles = (incommingFiles: any) => {
        setExtFiles(incommingFiles);
        setData('file', incommingFiles[0].file)
    }

    const {data, setData, post, errors, processing, recentlySuccessful} = useForm({
        file: null,
        name: '',
        description: ''
    });

    const submit = async (e: any) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append('file', data.file);
        formData.append('name', data.name);
        formData.append('description', data.description);

        let req = await fetch('api/pumps', {
            method: 'POST',
            body: formData
        })

        let lastProduct = await req.json();
    }

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Adicionar Produto</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <Dropzone
                    onChange={updateFiles}
                    minHeight="195px"
                    value={extFiles}
                    accept="image/*"
                    maxFiles={1}
                    maxFileSize={2 * 2048 * 1024}
                    label="Drag'n drop files here or click to browse"
                    uploadConfig={{
                        // autoUpload: true
                        cleanOnUpload: true,
                    }}
                >
                    {extFiles.map((file: any) => (
                        <FileMosaic
                            {...file}
                            key={file.id}
                            resultOnTooltip
                            alwaysActive
                            preview
                            info
                        />
                    ))}
                </Dropzone>
                <ImagePreview src={imageSrc} />
                <div className="grid grid-cols-2 items-center gap-2">
                    <Label htmlFor="name">
                        Nome
                    </Label>
                    <Input
                        name="name"
                        placeholder='Nome do Produto...'
                        className="col-span-3"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                    />
                </div>
                <div className="grid grid-cols-2 items-center gap-2">
                    <Label htmlFor="username">
                        Descrição
                    </Label>
                    <Textarea
                        name="description"
                        className="col-span-3"
                        placeholder="Descrição do Produto..."
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                    />
                </div>
            </div>
            <DialogFooter>
                <Button
                    className='bg-[#16628E]'
                    type="submit"
                    onClick={submit}
                >
                    Adicionar Produto
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}

// async function getAllPumps() {
//     const [allPumps, setAllPumps] = React.useState([]);
//
//     useEffect(() => {
//         async function getAllPumps() {
//             try {
//                 const allPumpsReq = await fetch('/pumps');
//                 setAllPumps(await allPumpsReq.json());
//             }catch(error) {
//                 console.error('Error fetching products:', error);
//             }
//         }
//
//         getAllPumps();
//     }, []);
// }
//
// console.log(getAllPumps())

// const data: Product[] = getAllPumps()

// async function products() {
//     const [allPumps, setAllPumps] = useState([]);
//
//     useEffect(() => {
//         async function getAllPumps() {
//             try {
//                 const allPumpsReq = await fetch('/pumps');
//                 setAllPumps(await allPumpsReq.json());
//             }catch(error) {
//                 console.error('Error fetching products:', error);
//             }
//         }
//
//         getAllPumps();
//     }, []);
//
//     return allPumps
// }
//
// console.log(products())

// @ts-ignore
// const data: Product[] = Products;

const data: Product[] = [
    {
        id: 2,
        image_url: 'sla.png',
        name: 'bomba12',
        description: "tralala",
    },
    {
        id: 1,
        image_url: 'sla2.png',
        name: 'bomba34',
        description: "kakaka",
    },
]

export type Product = {
    id: number
    image_url: string
    name: string
    description: string
}

export const columns: ColumnDef<Product>[] = [
    {
        accessorKey: "image_url",
        header: "Imagem",
        cell: ({row}) => (
            <img src={row.getValue("image_url")} className='capitalize' />
        ),
    },
    {
        accessorKey: "name",
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Nome
                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            )
        },
        cell: ({row}) => <div className="font-medium ml-3 lowercase">{row.getValue("name")}</div>,
    },
    {
        accessorKey: "description",
        header: () => <div>Descrição</div>,
        cell: ({row}) => <div>{row.getValue('description')}</div>,
    },
    {
        id: "actions",
        enableHiding: false,
        header: () => <div>Ação</div>,
        cell: ({row}) => {
            const payment = row.original

            return (
                <AlertDialog>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Abrir menu</span>
                                <MoreHorizontal className="h-4 w-4"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                            <DropdownMenuItem>Editar</DropdownMenuItem>
                            <DropdownMenuItem>
                                <AlertDialogTrigger asChild>
                                    <div className='w-full'>Excluir</div>
                                </AlertDialogTrigger>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Você tem certeza que deseja excluir este produto?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction className='bg-red-500'>Excluir</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )
        },
    },
]

export function DataTableDemo({data}: any) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    return (
        <div className='container'>
            <div className="w-full">
                <Dialog>
                    <DialogTrigger asChild>
                        <div className='flex justify-center'><Button className='bg-[#16628E] text-white mb-1' variant="outline">Adicionar Produto</Button></div>
                    </DialogTrigger>
                    <ProductForm />
                </Dialog>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex items-center justify-end space-x-2 py-4">
                    <div className="space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Anterior
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            Próximo
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const Icons = {
    spinner: Loader2,
};

export default function Index() {
    const [allPumps, setAllPumps] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        async function getAllPumps() {
            try {
                const allPumpsReq = await fetch('/pumps');
                const data = await allPumpsReq.json();
                setAllPumps(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        }

        getAllPumps();
    }, []);

    if (loading) {
        return (
            <div className="w-full h-full fixed top-0 left-0 bg-white opacity-75 z-50">
                <div className="flex justify-center items-center mt-[45vh]">
                    <Icons.spinner className="h-20 w-20 animate-spin"/>
                </div>
            </div>
        )
    }

    return <DataTableDemo data={allPumps} />;
}
