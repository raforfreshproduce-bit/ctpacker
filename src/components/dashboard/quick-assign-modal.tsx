"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import type { Assignment, Supervisor } from '@/lib/types';
import { useMemo, useEffect } from 'react';

interface QuickAssignModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  supervisors: Supervisor[];
  assignments: Assignment[];
  onUpdateAssignment: (assignment: Partial<Assignment> & { id: string }) => Promise<void>;
}

const formSchema = z.object({
  slotId: z.string({ required_error: 'Please select a slot.' }),
  supervisorName: z.string({ required_error: 'Please select a supervisor.' }),
  packerPickerName: z.string().min(2, { message: "Packer/Picker name must be at least 2 characters." }),
});

export default function QuickAssignModal({ isOpen, setIsOpen, supervisors, assignments, onUpdateAssignment }: QuickAssignModalProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      packerPickerName: '',
    },
  });

  const vacantSlots = useMemo(() => assignments.filter(a => !a.packerPickerName), [assignments]);

<<<<<<< HEAD
  useEffect(() => {
    if (!isOpen) {
      form.reset({ slotId: undefined, supervisorName: undefined, packerPickerName: '' });
    }
  }, [isOpen, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await onUpdateAssignment({
=======
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await onUpdateAssignment({
>>>>>>> main
      id: values.slotId,
      supervisorName: values.supervisorName,
      packerPickerName: values.packerPickerName,
    });
      toast({
        title: "Slot Assigned",
        description: `${values.slotId} has been assigned to ${values.packerPickerName}.`,
      });
    } catch (error: any) {
      console.error("Failed to update assignment:", error);
      toast({ variant: "destructive", title: "Error", description: "Failed to update assignment." });
    }
    form.reset();
    setIsOpen(false);
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
       <DialogHeader>





          <DialogTitle>Quick Assign Slot</DialogTitle>
          <DialogDescription>Quickly assign an employee to a vacant slot.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="slotId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target CTPACKER Slot</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger disabled={vacantSlots.length === 0}>
                        <SelectValue placeholder={vacantSlots.length > 0 ? "Select a vacant slot" : "No vacant slots"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {vacantSlots.map(slot => (
                        <SelectItem key={slot.id} value={slot.id}>{slot.id}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="supervisorName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supervisor</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a supervisor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {supervisors.map(supervisor => (
                        <SelectItem key={supervisor.id} value={supervisor.name}>{supervisor.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="packerPickerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Packer/Picker Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. JOHN DOE or J.DOE RECOUNT" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button type="submit">Assign Slot</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
