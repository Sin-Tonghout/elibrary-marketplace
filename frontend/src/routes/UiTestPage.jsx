import { useState } from 'react'
import { BookOpen, Settings, LogOut, User } from 'lucide-react'
import { getStoredTheme, applyTheme } from '../lib/theme.js'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { FormField } from '../components/ui/FormField.jsx'
import { EmptyState } from '../components/ui/EmptyState.jsx'
import { ErrorState } from '../components/ui/ErrorState.jsx'

export function UiTestPage() {
  const [theme, setTheme] = useState(getStoredTheme())
  const [agreed, setAgreed] = useState(false)
  const [category, setCategory] = useState('')

  function toggleTheme() {
    const next = theme === 'light' ? 'dark' : 'light'
    applyTheme(next)
    setTheme(next)
  }

  return (
    <div className="min-h-screen bg-background p-8 text-foreground">
      <div className="mx-auto flex max-w-2xl flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">UI component test</h1>
          <Button variant="outline" size="sm" onClick={toggleTheme}>
            Toggle theme ({theme})
          </Button>
        </div>

        <section className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5">
          <h2 className="font-semibold">Dialog</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Open book details</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>The Great Gatsby</DialogTitle>
                <DialogDescription>
                  A sample dialog standing in for a real book-details modal.
                </DialogDescription>
              </DialogHeader>
              <p className="text-sm text-muted-foreground">
                This confirms Dialog renders, traps focus, and closes correctly.
              </p>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Confirm</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </section>

        <section className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5">
          <h2 className="font-semibold">Tabs</h2>
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="pt-3 text-sm text-muted-foreground">
              Overview tab content.
            </TabsContent>
            <TabsContent value="reviews" className="pt-3 text-sm text-muted-foreground">
              Reviews tab content.
            </TabsContent>
            <TabsContent value="details" className="pt-3 text-sm text-muted-foreground">
              Details tab content.
            </TabsContent>
          </Tabs>
        </section>

        <section className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5">
          <h2 className="font-semibold">Dropdown menu</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <User className="h-4 w-4" /> Account
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <User className="h-4 w-4" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="h-4 w-4" /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <LogOut className="h-4 w-4" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </section>

        <section className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5">
          <h2 className="font-semibold">Select</h2>
          <FormField label="Category" htmlFor="category">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fiction">Fiction</SelectItem>
                <SelectItem value="nonfiction">Non-fiction</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
        </section>

        <section className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5">
          <h2 className="font-semibold">Checkbox</h2>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={agreed} onCheckedChange={setAgreed} />
            I agree to the Seller Agreement
          </label>
          <p className="text-sm text-muted-foreground">
            Agreed: {agreed ? 'yes' : 'no'}
          </p>
        </section>

        <section className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5">
          <h2 className="font-semibold">Tooltip</h2>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm">
                Hover me
              </Button>
            </TooltipTrigger>
            <TooltipContent>Platform commission is 7%</TooltipContent>
          </Tooltip>
        </section>

        <section className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5">
          <h2 className="font-semibold">Loading / empty / error (recap)</h2>
          <Skeleton className="h-4 w-1/2" />
          <EmptyState
            icon={BookOpen}
            title="No books yet"
            description="Books you purchase will show up here."
            action={<Button size="sm">Browse catalogue</Button>}
          />
          <ErrorState onRetry={() => alert('retry clicked')} />
        </section>
      </div>
    </div>
  )
}