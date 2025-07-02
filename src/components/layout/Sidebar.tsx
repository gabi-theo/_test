import React from 'react'
import { NavLink } from 'react-router-dom'
import { XMarkIcon } from '@heroicons/react/24/outline'
import {
  HomeIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
  BriefcaseIcon,
  UsersIcon,
  CogIcon,
  BuildingLibraryIcon,
  ClipboardDocumentListIcon,
  WrenchScrewdriverIcon,
  CpuChipIcon,
  DocumentArrowDownIcon,
  ChartBarIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Jurnale', href: '/journals', icon: DocumentTextIcon },
  { name: 'Accruals - Bonduri', href: '/accrual-bonds', icon: CurrencyDollarIcon },
  { name: 'Accruals - Depozite', href: '/accrual-deposits', icon: BanknotesIcon },
  { name: 'Portofoliu', href: '/portfolio', icon: BriefcaseIcon },
  { name: 'Parteneri', href: '/partners', icon: UsersIcon },
  { name: 'Instrumente', href: '/instruments', icon: CogIcon },
  { name: 'Depozite', href: '/deposits', icon: BuildingLibraryIcon },
  { name: 'Operațiuni', href: '/operations', icon: ClipboardDocumentListIcon },
  { name: 'Conturi contabile', href: '/accountability-accounts', icon: WrenchScrewdriverIcon },
  { name: 'Suport AI', href: '/ai-support', icon: CpuChipIcon },
  { name: 'Exporturi / Documente', href: '/doc-exports', icon: DocumentArrowDownIcon },
  { name: 'Statistici', href: '/statistics', icon: ChartBarIcon },
  { name: 'Utilizatori', href: '/users', icon: UserGroupIcon },
  { name: 'Erori', href: '/errors', icon: ExclamationTriangleIcon },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-900/80" onClick={onClose} />
          <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white px-6 pb-4 animate-slide-in">
            <div className="flex h-16 shrink-0 items-center justify-between">
              <h1 className="text-xl font-bold text-gray-900">NCH - Contabilitate</h1>
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-700"
                onClick={onClose}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <NavLink
                          to={item.href}
                          className={({ isActive }) =>
                            `sidebar-link ${isActive ? 'active' : ''}`
                          }
                          onClick={onClose}
                        >
                          <item.icon className="h-5 w-5 shrink-0" />
                          {item.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <h1 className="text-xl font-bold text-gray-900">NCH - Contabilitate</h1>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <NavLink
                        to={item.href}
                        className={({ isActive }) =>
                          `sidebar-link ${isActive ? 'active' : ''}`
                        }
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
                        {item.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
          
          <div className="mt-auto">
            <button
              onClick={() => window.open('http://10.100.180.3:8081', '_blank')}
              className="w-full btn btn-outline"
            >
              Extract App
            </button>
          </div>
        </div>
      </div>
    </>
  )
}