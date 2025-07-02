import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardBody } from '../components/ui/Card'

interface LoginForm {
  username: string
  password: string
}

export function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    try {
      await login(data.username, data.password)
      toast.success('Autentificare reușită!')
    } catch (error) {
      toast.error('Credențiale invalide')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            NCH - Contabilitate
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Conectează-te la contul tău
          </p>
        </div>
        
        <Card className="hover-lift">
          <CardBody>
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <Input
                label="Utilizator"
                type="text"
                autoComplete="username"
                {...register('username', { required: 'Utilizatorul este obligatoriu' })}
                error={errors.username?.message}
              />

              <Input
                label="Parolă"
                type="password"
                autoComplete="current-password"
                {...register('password', { required: 'Parola este obligatorie' })}
                error={errors.password?.message}
              />

              <Button
                type="submit"
                className="w-full"
                loading={isLoading}
                disabled={isLoading}
              >
                Conectează-te
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}