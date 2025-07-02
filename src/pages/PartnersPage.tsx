import React from 'react'
import { Card, CardHeader, CardBody } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { PlusIcon } from '@heroicons/react/24/outline'

export function PartnersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Parteneri</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestionează partenerii de afaceri
          </p>
        </div>
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" />
          Adaugă partener
        </Button>
      </div>

      <Card>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th>Cod</th>
                  <th>Tip</th>
                  <th>Cod Tip</th>
                  <th>Cod Jurnal</th>
                  <th>Nume</th>
                  <th className="text-right">Acțiuni</th>
                </tr>
              </thead>
              <tbody className="table-body">
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    Se încarcă datele...
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Tipuri Parteneri</h2>
          <Button variant="outline">
            <PlusIcon className="h-4 w-4 mr-2" />
            Adaugă tip partener
          </Button>
        </div>

        <Card>
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th>ID</th>
                    <th>Cod Tip</th>
                    <th>Cod Jurnal</th>
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
    </div>
  )
}