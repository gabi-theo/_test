import React from 'react'
import { Card, CardHeader, CardBody } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { EyeIcon } from '@heroicons/react/24/outline'

export function ErrorsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Erori Aplicație</h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitorizează erorile din sistem
        </p>
      </div>

      <Card>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th>Data</th>
                  <th>Logger</th>
                  <th>Level</th>
                  <th>Mesaj</th>
                  <th>Vizualizat</th>
                  <th className="text-right">Acțiuni</th>
                </tr>
              </thead>
              <tbody className="table-body">
                <tr>
                  <td>2024-01-15 14:30:25</td>
                  <td>django.request</td>
                  <td>
                    <Badge variant="danger">ERROR</Badge>
                  </td>
                  <td>Internal Server Error: /api/journals/</td>
                  <td>
                    <Badge variant="danger">Nu</Badge>
                  </td>
                  <td className="text-right">
                    <Button size="sm" variant="outline">
                      <EyeIcon className="h-4 w-4 mr-1" />
                      Detalii
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td>2024-01-15 13:45:12</td>
                  <td>portfolio.views</td>
                  <td>
                    <Badge variant="warning">WARNING</Badge>
                  </td>
                  <td>Invalid portfolio data received</td>
                  <td>
                    <Badge variant="success">Da</Badge>
                  </td>
                  <td className="text-right">
                    <Button size="sm" variant="outline">
                      <EyeIcon className="h-4 w-4 mr-1" />
                      Detalii
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td>2024-01-15 12:20:08</td>
                  <td>auth.middleware</td>
                  <td>
                    <Badge variant="info">INFO</Badge>
                  </td>
                  <td>User authentication successful</td>
                  <td>
                    <Badge variant="success">Da</Badge>
                  </td>
                  <td className="text-right">
                    <Button size="sm" variant="outline">
                      <EyeIcon className="h-4 w-4 mr-1" />
                      Detalii
                    </Button>
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