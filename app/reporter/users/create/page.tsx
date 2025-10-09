import UserCreate from '@/components/create-user'
import { LoadingSpinner } from '@/components/loading-spinner'
import React, { Suspense } from 'react'

function UserCreatePage() {
  return (<Suspense fallback={<LoadingSpinner />}><UserCreate/></Suspense>
    
  )
}

export default UserCreatePage