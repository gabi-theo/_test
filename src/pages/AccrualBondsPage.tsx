import React from 'react'
import { Card, CardHeader, CardBody } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

export function AccrualBondsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dobânzi Obligațiuni</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestionează accruals pentru obligațiuni
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">Generează Accruals</Button>
          <Button variant="success">Exportă CSV</Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardBody>
          <div className="flex items-center space-x-4">
            <Input
              placeholder="Caută..."
              className="flex-1"
            />
            <Button>Caută</Button>
          </div>
        </CardBody>
      </Card>

      {/* Table */}
      <Card>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th>UBO</th>
                  <th>Custodian</th>
                  <th>Partener</th>
                  <th>Cont</th>
                  <th>Instrument</th>
                  <th>Valută</th>
                  <th>Data</th>
                  <th>Operațiune</th>
                  <th>Detalii</th>
                  <th>Prioritate</th>
                  <th>Cantitate</th>
                  <th>Total Cantitate</th>
                  <th>Valoare</th>
                  <th>Total Dobândă</th>
                  <th>Dobândă</th>
                  <th>Dobândă Valută</th>
                  <th>Dobândă RON</th>
                  <th>Total Dobândă Valută</th>
                  <th>Total Dobândă RON</th>
                  <th>Reevaluare Total</th>
                  <th>Total Dif. FX</th>
                  <th>Dif. FX</th>
                  <th>BNR</th>
                  <th>BNR EOM</th>
                  <th>Cupon încasat</th>
                  <th>Dobândă Settle</th>
                  <th>Incremental</th>
                  <th className="text-right">Acțiuni</th>
                </tr>
              </thead>
              <tbody className="table-body">
                <tr>
                  <td colSpan={28} className="text-center py-8 text-gray-500">
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