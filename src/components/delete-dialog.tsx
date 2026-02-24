'use client'

import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useTranslation } from 'react-i18next'

export type DeleteDialogMode = 'single' | 'multi'

export type DeleteDialogConfig = {
  /** 'single' for one item, 'multi' for multiple items from table selection */
  mode: DeleteDialogMode
  /** The item to delete (required for single mode) */
  item?: { id: string; label: string; [key: string]: any }
  /** Table instance (required for multi mode) */
  table?: Table<any>
  /** i18n namespace for translations (e.g., 'profiles', 'users', 'forms') */
  namespace: string
  /** Confirmation strategy: 'typed' (type item label) or 'keyword' (type DELETE keyword) */
  confirmStrategy?: 'typed' | 'keyword'
  /** Callback when delete is confirmed */
  onDelete: (itemsOrIds: string | string[] | any[]) => void | Promise<void>
  /** Optional callback before dialog closes */
  onBeforeClose?: () => void | Promise<void>
}

export type DeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  config: DeleteDialogConfig
}

export function DeleteDialog({
  open,
  onOpenChange,
  config,
}: DeleteDialogProps) {
    const { t } = useTranslation('common');
    const [value, setValue] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const isMulti = config.mode === 'multi'
    const confirmStrategy = config.confirmStrategy ?? (isMulti ? 'keyword' : 'typed')

    // Get items count and labels
    const itemCount = isMulti
        ? config.table?.getFilteredSelectedRowModel().rows.length ?? 0
        : 1
    const itemLabel = isMulti
        ? null
        : config.item?.label ?? ''

    // Determine expected confirmation value
    const expectedValue =
        confirmStrategy === 'keyword' 
            ? t('deleteDialog.multi.deafultConfirmWord') : itemLabel;

    const isConfirmed = value.trim() === expectedValue?.trim()
    const isDisabled = !isConfirmed || isLoading

    const handleDelete = async () => {
        if (!isConfirmed) return

        try {
        setIsLoading(true)

        if (isMulti && config.table) {
            const selectedRows = config.table.getFilteredSelectedRowModel().rows
            await config.onDelete(selectedRows.map((row: any) => row.original.id))
        } else if (!isMulti && config.item) {
            await config.onDelete(config.item.id)
        }

        if (config.onBeforeClose) {
            await config.onBeforeClose()
        }

        onOpenChange(false)
        setValue('')
        } finally {
        setIsLoading(false)
        }
    }

    const getTitle = () => {
        if (isMulti) {
        return (
            <span className='text-destructive'>
            <AlertTriangle className='stroke-destructive me-1 inline-block' size={18} />
            {t('deleteDialog.multi.title', {
                count: itemCount
            })}
            </span>
        )
        }
        return (
        <span className='text-destructive'>
            <AlertTriangle className='stroke-destructive me-1 inline-block' size={18} />
            {t('deleteDialog.single.title', 'Delete Item')}
        </span>
        )
    }

    const getConfirmationLabel = () => {
        if (confirmStrategy === 'keyword') {
            return t('deleteDialog.confirm.keyword', {
                label: t('deleteDialog.multi.deafultConfirmWord')
            })
        }
        return t('deleteDialog.confirm.label', {
            label: itemLabel
        })
    }

    const getConfirmationPlaceholder = () => {
        if (confirmStrategy === 'keyword') {
            return t('deleteDialog.confirm.keywordPlaceholder', {
                label: t('deleteDialog.multi.deafultConfirmWord')
            })
        }
        return t('deleteDialog.confirm.placeholder', { 
            label: itemLabel
        });
    }

    return (
        <ConfirmDialog
        open={open}
        onOpenChange={onOpenChange}
        handleConfirm={handleDelete}
        disabled={isDisabled}
        title={getTitle()}
        desc={
            <div className='space-y-4'>
            <p className='mb-2'>
                {isMulti ? t('deleteDialog.multi.description', {
                        count: itemCount
                    }) : t('deleteDialog.single.description', {
                        label: itemLabel
                    })}
            </p>

            <Label className='my-2 flex flex-col items-start gap-1.5'>
                <span>{getConfirmationLabel()}:</span>
                <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={getConfirmationPlaceholder()}
                disabled={isLoading}
                />
            </Label>

            <Alert variant='destructive'>
                <AlertTitle>{t('deleteDialog.warning.title')}</AlertTitle>
                <AlertDescription>
                {t('deleteDialog.warning.description')}
                </AlertDescription>
            </Alert>
            </div>
        }
        confirmText={t('deleteDialog.confirmButton')}
        destructive
        />
    )
}
