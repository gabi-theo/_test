import React from 'react'
import { Card, CardBody } from '../components/ui/Card'

export function StatisticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Statistici</h1>
        <p className="mt-1 text-sm text-gray-500">
          Vizualizează statisticile sistemului
        </p>
      </div>

      <Card>
        <CardBody>
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              În curând
            </h3>
            <p className="text-gray-500">
              Funcționalitatea pentru statistici va fi disponibilă în curând.
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}