"use client"

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useUsers } from './users-provider'
import { Link } from '@tanstack/react-router'

export function UsersViewDialog({ open, onOpenChange, currentRow }:{ open:boolean; onOpenChange:(b:boolean)=>void; currentRow:any }){
  if(!currentRow) return null
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>View User</DialogTitle>
        </DialogHeader>
        <Card>
          <CardHeader>
            <CardTitle>{currentRow.firstName} {currentRow.lastName}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid gap-2'>
              <div><strong>Username:</strong> {currentRow.username}</div>
              <div><strong>CPF:</strong> {currentRow.cpf}</div>
              <div><strong>Email:</strong> {currentRow.email}</div>
              <div><strong>Profile:</strong> {currentRow.role}</div>
              <div><strong>Status:</strong> {currentRow.status}</div>
            </div>
          </CardContent>
        </Card>
        <DialogFooter>
          <Button variant='secondary' asChild>
            <Link to={`/users`}>
              Back
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default UsersViewDialog
