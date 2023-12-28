import {
    CalendarIcon,
    CheckIcon,
    QrCodeIcon,
    FlagIcon,
    CalendarDaysIcon,
    HashtagIcon,
    PrinterIcon,
    InboxIcon,
} from '@heroicons/react/20/solid'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'


export default function PageHeading() {
    return (
        <div className="mx-9">
            <div className="flex justify-between space-y-4">
                <div className="min-w-2 flex-2">
                    <div className="flex items-center gap-2 ">
                        <QrCodeIcon className="h-5 w-5" aria-hidden="true" />
                        000000000000

                    </div>
                    <div className="flex items-center gap-10">
                        <h2 className="text-2xl font-bold leading- sm:truncate sm:text-3xl sm:tracking-tight">
                            Nome do fulano
                        </h2>
                        <Badge variant="destructive">Urgente</Badge>
                    </div>

                    <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                            <FlagIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                            Anatomo patolgoico
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                            <CalendarDaysIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                            00/00/0000 - 12 anos
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                            <HashtagIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                            Macroscopia
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                            <CalendarIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                            Closing on January 9, 2020
                        </div>
                    </div>
                </div>
                <div className="mt-5 pt-6 flex lg:ml-4 lg:mt-0">
                    <span className="hidden sm:block">

                        <Button
                            variant="secondary"
                        >
                            <InboxIcon className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                            Comentarios
                        </Button>
                    </span>

                    <span className="ml-3 hidden sm:block">
                        <Button
                            variant="secondary"
                        >
                            <PrinterIcon className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                            Imprimir
                        </Button>
                    </span>

                    <span className="sm:ml-3">
                        <Button
                        >
                            <CheckIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                            Salvar
                        </Button>
                    </span>

                    {/* Dropdown */}

                </div>
            </div>
        </div>
    )
}
