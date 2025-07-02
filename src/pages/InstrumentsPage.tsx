import React from 'react'
import { Card, CardHeader, CardBody } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { PlusIcon } from '@heroicons/react/24/outline'

export function InstrumentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Instrumente</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestionează instrumentele financiare
          </p>
        </div>
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" />
          Adaugă instrument
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardBody>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Input
              placeholder="Caută după symbol, ISIN, name..."
            />
            <Select
              options={[
                { value: '', label: '-- Filtru custodian --' },
              ]}
            />
            <Select
              options={[
                { value: '', label: '-- Filtru monedă --' },
              ]}
            />
            <Button variant="outline" className="w-full">
              Resetează
            </Button>
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
                  <th>Symbol</th>
                  <th>ISIN</th>
                  <th>Custodian</th>
                  <th>Currency</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Principal</th>
                  <th>Face Value</th>
                  <th>Interest</th>
                  <th>Depo Start</th>
                  <th>Bond Issue</th>
                  <th>First Coupon</th>
                  <th>Maturity</th>
                  <th>Convention</th>
                  <th>Calendar</th>
                  <th>Coupon Count</th>
                  <th>Sector</th>
                  <th>Country</th>
                  <th>Needs Check</th>
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