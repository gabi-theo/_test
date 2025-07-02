import React from 'react'
import { Card, CardHeader, CardBody } from '../components/ui/Card'
import {
  DocumentTextIcon,
  CurrencyDollarIcon,
  BriefcaseIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'

const stats = [
  {
    name: 'Total Jurnale',
    value: '2,651',
    icon: DocumentTextIcon,
    change: '+4.75%',
    changeType: 'positive',
  },
  {
    name: 'Accruals Active',
    value: '1,423',
    icon: CurrencyDollarIcon,
    change: '+54.02%',
    changeType: 'positive',
  },
  {
    name: 'Portofolii',
    value: '892',
    icon: BriefcaseIcon,
    change: '-1.39%',
    changeType: 'negative',
  },
  {
    name: 'Parteneri',
    value: '245',
    icon: UsersIcon,
    change: '+10.18%',
    changeType: 'positive',
  },
]

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Privire de ansamblu asupra sistemului de contabilitate
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="hover-lift">
            <CardBody>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-8 w-8 text-primary-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </div>
                      <div
                        className={`ml-2 flex items-baseline text-sm font-semibold ${
                          stat.changeType === 'positive'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {stat.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-gray-900">
              Activitate Recentă
            </h3>
          </CardHeader>
          <CardBody>
            <div className="flow-root">
              <ul className="-mb-8">
                {[1, 2, 3, 4].map((item, itemIdx) => (
                  <li key={item}>
                    <div className="relative pb-8">
                      {itemIdx !== 3 ? (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center ring-8 ring-white">
                            <DocumentTextIcon className="h-4 w-4 text-white" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              Jurnal nou adăugat pentru{' '}
                              <span className="font-medium text-gray-900">
                                AAPL
                              </span>
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            <time>1h</time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-gray-900">
              Statistici Rapide
            </h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Jurnale astăzi</span>
                <span className="text-sm font-medium text-gray-900">23</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Accruals calculate</span>
                <span className="text-sm font-medium text-gray-900">156</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Erori active</span>
                <span className="text-sm font-medium text-red-600">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Utilizatori online</span>
                <span className="text-sm font-medium text-green-600">12</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}