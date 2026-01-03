import { z } from 'zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { featureGroups } from '@/features/features/data/features'
import type { Profile } from '../data/schema'

const formSchema = z.object({
  name: z.string().min(1, 'Profile name is required'),
  description: z.string().optional(),
  permissions: z.array(z.string()).min(1, 'Select at least one permission'),
})

export type FormValues = z.infer<typeof formSchema>

type Props = {
  initialValues?: Partial<Profile>
  submitLabel?: string
  onSubmit: (values: FormValues) => void | Promise<void>
  onCancel?: () => void
}

export default function ProfileForm({ initialValues, submitLabel = 'Save', onSubmit, onCancel }: Props) {
  const [permissionsOpen, setPermissionsOpen] = useState(true)
  const [groupEnabled, setGroupEnabled] = useState<Record<string, boolean>>(
    () => Object.fromEntries(featureGroups.map((g) => [g.id, true]))
  )
  const [groupOpen, setGroupOpen] = useState<Record<string, boolean>>(
    () => Object.fromEntries(featureGroups.map((g) => [g.id, false]))
  )
  const [permQuery, setPermQuery] = useState('')

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', description: '', permissions: [] },
  })

  useEffect(() => {
    if (!initialValues) return
    form.reset({
      name: initialValues.label ?? '',
      description: initialValues.description ?? '',
      permissions: initialValues.permissions ?? [],
    })
    // also restore group enabled/open state if desired (keep defaults)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues])

  // when searching, auto-open matching groups
  useEffect(() => {
    if (!permQuery) return
    const next = { ...groupOpen }
    featureGroups.forEach((g) => {
      const hasMatch = g.children.some((c) => c.label.toLowerCase().includes(permQuery.toLowerCase()))
      if (hasMatch) next[g.id] = true
    })
    setGroupOpen(next)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permQuery])

  const submit = (values: FormValues) => {
    const enabledPermissions = values.permissions.filter((p) => {
      const group = featureGroups.find((g) => p.startsWith(`${g.id}.`) || p.startsWith(`${g.id}`))
      return group ? groupEnabled[group.id] : true
    })
    if (enabledPermissions.length === 0) {
      form.setError('permissions', { message: 'Select at least one permission' })
      return
    }
    return onSubmit({ ...values, permissions: enabledPermissions })
  }

  const togglePermission = (perm: string) => {
    const current: string[] = form.getValues('permissions') || []
    if (current.includes(perm)) {
      form.setValue('permissions', current.filter((p) => p !== perm))
    } else {
      form.setValue('permissions', [...current, perm])
    }
  }

  const toggleGroup = (groupId: string) => {
    setGroupEnabled((s) => {
      const next = { ...s, [groupId]: !s[groupId] }
      if (!next[groupId]) {
        const group = featureGroups.find((g) => g.id === groupId)
        if (group) {
          const current = form.getValues('permissions') || []
          const filtered = current.filter((p) => !group.children.some((c) => c.id === p))
          form.setValue('permissions', filtered)
        }
      }
      return next
    })
  }

  return (
    <Form {...form}>
      <form id='profile-form' onSubmit={form.handleSubmit(submit)} className='space-y-6'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile name</FormLabel>
              <FormControl>
                <Input placeholder='e.g., Manager' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <Textarea placeholder='A short description for this profile' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='permissions'
          render={() => (
            <FormItem>
              <Collapsible open={permissionsOpen} onOpenChange={setPermissionsOpen}>
                <div className='mb-2 flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <CollapsibleTrigger asChild>
                      <button type='button' className='flex items-center gap-2 text-sm font-medium'>
                        <span>Permissions</span>
                        <span className='text-xs text-muted-foreground'>({(form.getValues('permissions') || []).length} selected)</span>
                      </button>
                    </CollapsibleTrigger>
                  </div>
                  <button
                    type='button'
                    aria-label={permissionsOpen ? 'Collapse permissions' : 'Expand permissions'}
                    onClick={() => setPermissionsOpen((v) => !v)}
                    className='p-1'
                  >
                    <ChevronDown className={`transition-transform ${permissionsOpen ? 'rotate-180' : 'rotate-0'}`} />
                  </button>
                </div>

                <div className='mb-3 flex items-center gap-3'>
                  <Input
                    placeholder='Search permissions...'
                    value={permQuery}
                    onChange={(e) => setPermQuery(e.target.value)}
                    className='max-w-sm'
                  />
                  <div className='ms-auto flex gap-2'>
                    <Button variant='ghost' size='sm' onClick={(e) => {
                      e.preventDefault()
                      setGroupOpen(Object.fromEntries(featureGroups.map((g) => [g.id, true])))
                    }}>
                      Expand all
                    </Button>
                    <Button variant='ghost' size='sm' onClick={(e) => {
                      e.preventDefault()
                      setGroupOpen(Object.fromEntries(featureGroups.map((g) => [g.id, false])))
                    }}>
                      Collapse all
                    </Button>
                  </div>
                </div>

                <CollapsibleContent>
                  <div className='gap-4'>
                    {featureGroups.map((group) => {
                      const filtered = permQuery
                        ? group.children.filter((c) => c.label.toLowerCase().includes(permQuery.toLowerCase()))
                        : group.children

                      if (filtered.length === 0) return null

                      const selectedCount = filtered.filter((c) => (form.getValues('permissions') || []).includes(c.id)).length
                      const allSelected = selectedCount === filtered.length
                      const someSelected = selectedCount > 0 && !allSelected
                      return (
                        <div key={group.id} className='rounded-md border p-3'>
                          <Collapsible open={groupOpen[group.id]} onOpenChange={(v) => setGroupOpen((s) => ({ ...s, [group.id]: v }))}>
                            <div className='mb-2 flex items-center justify-between'>
                              <div className='flex items-center gap-2'>
                                <Checkbox
                                  checked={allSelected ? true : someSelected ? 'indeterminate' : false}
                                  onCheckedChange={() => {
                                    const current = form.getValues('permissions') || []
                                    if (!groupEnabled[group.id] && !allSelected) toggleGroup(group.id)
                                    if (allSelected) {
                                      form.setValue('permissions', current.filter((p) => !filtered.some((c) => c.id === p)))
                                    } else {
                                      const toAdd = filtered.map((c) => c.id).filter((id) => !current.includes(id))
                                      form.setValue('permissions', [...current, ...toAdd])
                                    }
                                  }}
                                />
                                <CollapsibleTrigger asChild>
                                  <button type='button' className='flex items-center gap-2 text-sm font-medium'>
                                    <span>{group.label}</span>
                                    <span className='text-xs text-muted-foreground'>({selectedCount} selected)</span>
                                  </button>
                                </CollapsibleTrigger>
                              </div>
                              <div className='flex items-center gap-2'>
                                <Switch checked={!!groupEnabled[group.id]} onCheckedChange={() => toggleGroup(group.id)} />
                                <button
                                  type='button'
                                  aria-label={groupOpen[group.id] ? 'Collapse group' : 'Expand group'}
                                  onClick={() => setGroupOpen((s) => ({ ...s, [group.id]: !s[group.id] }))}
                                  className='p-1'
                                >
                                  <ChevronDown className={`transition-transform ${groupOpen[group.id] ? 'rotate-180' : 'rotate-0'}`} />
                                </button>
                              </div>
                            </div>

                            <CollapsibleContent>
                              <div className='grid gap-2 grid-cols-1 sm:grid-cols-2'>
                                {filtered.map((perm) => (
                                  <label key={perm.id} className={`inline-flex items-center gap-2 ${!groupEnabled[group.id] ? 'opacity-50' : ''}`}>
                                    <Checkbox
                                      checked={(form.getValues('permissions') || []).includes(perm.id)}
                                      disabled={!groupEnabled[group.id]}
                                      onCheckedChange={() => togglePermission(perm.id)}
                                    />
                                    <span className='text-sm'>{perm.label}</span>
                                  </label>
                                ))}
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        </div>
                      )
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex items-center gap-2'>
          {onCancel ? (
            <Button variant='outline' onClick={onCancel}>Cancel</Button>
          ) : null}
          <Button type='submit' form='profile-form'>{submitLabel}</Button>
        </div>
      </form>
    </Form>
  )
}
