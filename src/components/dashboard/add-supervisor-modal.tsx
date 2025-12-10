"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Supervisor } from '@/lib/types';

interface AddSupervisorModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  supervisors: Supervisor[];
  onAddSupervisor: (name: string) => Promise<void>;
  onRemoveSupervisor: (id: string) => Promise<void>;
}

const formSchema = z.object({
  name: z.string().min(2, { message: "Supervisor name must be at least 2 characters." }).max(50),
});

export default function AddSupervisorModal({ isOpen, setIsOpen, supervisors, onAddSupervisor, onRemoveSupervisor }: AddSupervisorModalProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await onAddSupervisor(values.name);
    toast({
      title: "Success",
      description: `Supervisor "${values.name.toUpperCase()}" has been added.`,
    });
    form.reset();
    setIsOpen(false);
  }

  async function handleRemove(supervisor: Supervisor) {
    await onRemoveSupervisor(supervisor.id);
    toast({
      title: "Supervisor Removed",
      description: `"${supervisor.name}" has been removed.`,
    });
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) form.reset({ name: '' });
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Supervisor</DialogTitle>
          <DialogDescription>
            Enter the name of the new supervisor. It will be saved in ALL CAPS.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supervisor Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. JANE DOE" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Existing Supervisors</h4>
              <div className="max-h-48 overflow-y-auto rounded-md border p-2">
                {supervisors.length > 0 ? (
                  <ul className="space-y-2">
                    {supervisors.map((supervisor) => (
                      <li key={supervisor.id} className="flex items-center justify-between text-sm">
                        <span>{supervisor.name}</span>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently remove the supervisor "{supervisor.name}". Any slots assigned to them will become unassigned.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleRemove(supervisor)} className="bg-destructive hover:bg-destructive/90">Remove</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No supervisors added yet.</p>
                )}
              </div>
            </div>
            <DialogFooter> <Button type="submit">Add Supervisor</Button> </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
