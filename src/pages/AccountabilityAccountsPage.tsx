import React from 'react'
import { Card, CardHeader, CardBody } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { PlusIcon, ArrowDownTrayIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline'

export function AccountabilityAccountsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Conturi contabile - Mapări Saga</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestionează mapările conturilor contabile
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Descarcă Template Excel
          </Button>
          <Button variant="outline">
            <ArrowUpTrayIcon className="h-4 w-4 mr-2" />
            Încarcă Excel
          </Button>
          <Button>
            <PlusIcon className="h-4 w-4 mr-2" />
            Adaugă mapare cont
          </Button>
        </div>
      </div>

      <Card>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th>ID</th>
                  <th>Cont SAGA</th>
                  <th>Cont Principal</th>
                  <th className="text-right">Acțiuni</th>
                </tr>
              </thead>
              <tbody className="table-body">
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-500">
                    Se încarcă datele...
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}