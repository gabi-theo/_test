import React from 'react'
import { Card, CardHeader, CardBody } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export function JournalsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Jurnale Tranzacții</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestionează jurnalele de tranzacții
          </p>
        </div>
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" />
          Adaugă jurnal
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardBody>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Input
              placeholder="Caută..."
              className="w-full"
            />
            <Input
              type="date"
              label="De la data"
            />
            <Input
              type="date"
              label="Până la data"
            />
            <div className="flex items-end space-x-2">
              <Button variant="outline" className="flex-1">
                <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                Caută
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Export buttons */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline">Exportă Excel</Button>
        <Button variant="outline">Exportă DBF</Button>
        <Button variant="outline">Importă Jurnal IBKR</Button>
        <Button variant="outline">Importă Jurnal TDV</Button>
      </div>

      {/* Table */}
      <Card>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th>ID</th>
                  <th>Data</th>
                  <th>Tranzacție</th>
                  <th>UBO</th>
                  <th>Custodian</th>
                  <th>Cont</th>
                  <th>Operațiune</th>
                  <th>Partener</th>
                  <th>Instrument</th>
                  <th>Monedă</th>
                  <th>Cantitate</th>
                  <th>Detalii</th>
                  <th>Valoare</th>
                  <th>Valoare RON</th>
                  <th>BNR</th>
                  <th>Storno</th>
                  <th>Blocat</th>
                  <th>Cont Debit</th>
                  <th>Cont Credit</th>
                  <th className="text-right">Acțiuni</th>
                </tr>
              </thead>
              <tbody className="table-body">
                <tr>
                  <td colSpan={20} className="text-center py-8 text-gray-500">
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