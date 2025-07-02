import React from 'react'
import { Card, CardHeader, CardBody } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { PlusIcon } from '@heroicons/react/24/outline'

export function PortfolioPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Portofolii</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestionează portofoliile de investiții
          </p>
        </div>
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" />
          Adaugă portofoliu
        </Button>
      </div>

      <Card>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th>UBO</th>
                  <th>Instrument</th>
                  <th>Data</th>
                  <th>Cost</th>
                  <th>Valoare</th>
                  <th>Cantitate</th>
                  <th>Dobândă acumulată</th>
                  <th className="text-right">Acțiuni</th>
                </tr>
              </thead>
              <tbody className="table-body">
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-500">
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